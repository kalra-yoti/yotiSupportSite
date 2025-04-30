import { LightningElement, track, wire } from 'lwc';
import searchKnowledgeArticles from '@salesforce/apex/YotiSupportSiteController.searchKnowledgeArticles';
import IMAGES from '@salesforce/resourceUrl/IMAGES';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class SearchResults extends LightningElement {
    @track isMobileNavigation = false;
    receivedMessage;
    @wire(MessageContext) messageContext;
    @track resultsCount = 0;
    @track keyword = '';
    @track articles = [];
    @track filteredArticles = [];
    businessSupport = IMAGES + '/businessSupport.png';
    individualSupport = IMAGES + '/individualSupport.png';
    chevronDown = IMAGES + '/chevron_down.png';
    warningIcon = IMAGES + '/warning.png';
    selectedProduct = '';
    selectedSupportType = '';
    @track isResultsCountZero = false;

    get selectedLabelClassProduct() {
        return this.selectedProduct ? 'shrink' : '';
    }

    get selectedLabelClassSupport() {
        return this.selectedSupportType ? 'shrink' : '';
    }

    // Dropdown Options
    productOptions = [
        { label: 'Age verification', value: 'Age verification' },
        { label: 'eSignatures', value: 'eSignatures' },
        { label: 'General Business Questions', value: 'General Business Questions' },
        { label: 'ID documents', value: 'ID documents' },
        { label: 'Identity Verification', value: 'Identity Verification' },
        { label: 'Organisation Onboarding', value: 'Organisation Onboarding' },
        { label: 'Pricing', value: 'Pricing' },
        { label: 'Security', value: 'Security' },
        { label: 'Social Purpose', value: 'Social Purpose' },
        { label: 'Technical terms', value: 'Technical terms' },
        { label: 'Using Yoti Online', value: 'Using Yoti Online' },
        { label: 'Web account', value: 'Web account' },
        { label: 'Yoti app', value: 'Yoti app' },
        { label: 'Yoti password manager', value: 'Yoti password manager' },
        { label: 'Yoti Portal', value: 'Yoti Portal' },
        { label: 'YotiHub', value: 'YotiHub' }
    ];

    supportTypeOptions = [
        { label: 'Business Support', value: 'Businesses' },
        { label: 'Individual Support', value: 'Individuals' }
    ];

    async connectedCallback() {
        try {
            const params = new URLSearchParams(window.location.search);
            this.keyword = params.get('searchKeyword') || '';

            if (this.keyword) {
                this.fetchArticles(this.keyword);
            }

            this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });

            let style = document.createElement('style');
            style.innerHTML = `
                .custom-dropdown::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    width: 28px;
                    height: 28px;
                    background-image: url('${this.chevronDown}');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error in connectedCallback:', error);
        }
    }

    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (this.receivedMessage === 'Hamburger Clicked' || this.receivedMessage === 'Search Icon Clicked') {
                this.isMobileNavigation = true;
            } else {
                this.isMobileNavigation = false;
            }
        } catch (error) {
            console.error('Error in handleMessage:', error);
        }
    }

    renderedCallback() {
        try {
            if (this.resultsCount == 0) {
                this.isResultsCountZero = true;
            } else {
                this.isResultsCountZero = false;
            }
        } catch (error) {
            console.error('Error in renderedCallback:', error);
        }
    }

    fetchArticles(keyword) {
        try {
            searchKnowledgeArticles({ searchKeyword: keyword })
                .then(result => {
                    this.articles = result;
                    this.articles = this.articles.map(article => {
                        let tempDiv = document.createElement("div");
                        tempDiv.innerHTML = article.Answer__c;
                        let cleanText = tempDiv.textContent || tempDiv.innerText || "";
                        let truncatedText = cleanText.length > 200 ? cleanText.substring(0, 197) + "..." : cleanText;

                        let updatedTopic = article.Topic__c === "For Businesses" ? "Businesses" : 
                                    article.Topic__c === "For Individuals" ? "Individuals" : 
                                    article.Topic__c;

                        let topicIconImage = article.Topic__c === "For Businesses" ? this.businessSupport : 
                        article.Topic__c === "For Individuals" ? this.individualSupport : 
                        article.UrlName;

                        let formattedDate = "";
                        const dateString = article.LastPublishedDate;
                        const date = new Date(dateString);
                        const day = String(date.getUTCDate()).padStart(2, '0');
                        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                        const year = date.getUTCFullYear();
                        formattedDate = `${day}/${month}/${year}`;

                        return { ...article, Answer__c: truncatedText, Topic__c: updatedTopic, UrlName: topicIconImage, Lastpublisheddate: formattedDate };
                    });

                    this.filteredArticles = this.articles;
                    this.resultsCount = this.filteredArticles.length;
                    this.isResultsCountZero = this.resultsCount === 0;
                })
                .catch(error => {
                    console.error('Error fetching articles:', error);
                    this.articles = [];
                });
        } catch (error) {
            console.error('Error in fetchArticles:', error);
        }
    }

    handleProductChange(event) {
        try {
            this.selectedProduct = event.target.value;

            if (this.selectedSupportType !== '') {
                this.filteredArticles = this.articles.filter(article => 
                    article.Sub_Topic__c === this.selectedProduct &&
                    article.Topic__c === this.selectedSupportType
                );
            } else {
                this.filteredArticles = this.articles.filter(article => 
                    article.Sub_Topic__c === this.selectedProduct
                );
            }

            this.resultsCount = this.filteredArticles.length;
            this.isResultsCountZero = this.resultsCount === 0;
        } catch (error) {
            console.error('Error in handleProductChange:', error);
        }
    }

    handleSupportTypeChange(event) {
        try {
            this.selectedSupportType = event.target.value;

            if (this.selectedProduct !== '') {
                this.filteredArticles = this.articles.filter(article => 
                    article.Topic__c === this.selectedSupportType &&
                    article.Sub_Topic__c === this.selectedProduct 
                );
            } else {
                this.filteredArticles = this.articles.filter(article => 
                    article.Topic__c === this.selectedSupportType
                );
            }

            this.resultsCount = this.filteredArticles.length;
            this.isResultsCountZero = this.resultsCount === 0;
        } catch (error) {
            console.error('Error in handleSupportTypeChange:', error);
        }
    }

    handleArticle(event) {
        try {
            let articleId = event.target.id.split('-')[0];
            let category = event.currentTarget.dataset.subcategory;
            let type = event.currentTarget.dataset.topic;
            let product = event.currentTarget.dataset.subtopic;
            if (articleId && category && type && product) {
                window.location.href = '/yotiSupportSite/article-detail?type=' + type + '&product=' + product + '&articleId=' + articleId + '&category=' + category;
            }
        } catch (error) {
            console.error('Error in handleArticle:', error);
        }
    }
}
