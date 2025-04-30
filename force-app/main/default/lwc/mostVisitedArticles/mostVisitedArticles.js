import { LightningElement, track, wire } from 'lwc';
import getTopFAQItems from '@salesforce/apex/YotiSupportSiteController.getTopFAQItems';
import { subscribe, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';

export default class MostVisitedArticles extends LightningElement {
    receivedMessage;
    @track isHamburgerClicked = false;

    @wire(MessageContext)
    messageContext;

    subscription;

    // Reactive property to store keyword from the URL
    @track keyword = '';
    @track faqItems = [];

    connectedCallback() {
        try {
            // Subscribe to the message channel
            this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
            });

            // Fetch keyword from the URL parameters
            const params = new URLSearchParams(window.location.search);
            this.keyword = params.get('type') || '';
        } catch (error) {
            console.error('Error during connectedCallback:', error);
        }
    }

    // Handle the hamburger click or search icon click
    handleMessage(message) {
        try {
            this.receivedMessage = message.messageText;
            if (this.receivedMessage === 'Hamburger Clicked' || this.receivedMessage === 'Search Icon Clicked') {
                this.isMobileNavigation = true;
            } else {
                this.isMobileNavigation = false;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    // Wire to fetch FAQ items based on the keyword (URL parameter)
    @wire(getTopFAQItems, { topic: '$keyword' })
    wiredFaqItems({ error, data }) {
        try {
            if (data) {
                this.faqItems = data.map((item) => ({
                    id: item.Id,
                    question: item.Title,
                    topic: item.Topic__c,
                    subtopic: item.Sub_Topic__c,
                    subcategory: item.Sub_Category__c
                }));
            } else if (error) {
                console.error('Error fetching FAQ items:', error);
                // Optionally, display a user-friendly message or take other action
            }
        } catch (error) {
            console.error('Error in wiredFaqItems:', error);
        }
    }

    // Handle article click and redirect to article details page
    handleArticle(event) {
        try {
            const articleId = event.target.id?.split('-')[0];
            const category = event.currentTarget.dataset.subcategory;
            const type = event.currentTarget.dataset.topic;
            const product = event.currentTarget.dataset.subtopic;

            // Only proceed if all necessary data is available
            if (articleId && category && type && product) {
                window.location.href = `/yotiSupportSite/article-detail?type=${type}&product=${product}&articleId=${articleId}&category=${category}`;
            } else {
                console.warn('Missing required article data for navigation.');
            }
        } catch (error) {
            console.error('Error handling article click:', error);
        }
    }

    // Cleanup subscription when component is destroyed
    disconnectedCallback() {
        try {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
        } catch (error) {
            console.error('Error during disconnectedCallback:', error);
        }
    }
}
