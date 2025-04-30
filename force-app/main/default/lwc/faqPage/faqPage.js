import { LightningElement,track,wire } from 'lwc';

import righticon from '@salesforce/resourceUrl/rightIcon';
import IMAGES from '@salesforce/resourceUrl/Images';
import { CurrentPageReference } from 'lightning/navigation';
import getArticle from '@salesforce/apex/YotiSupportSiteController.getArticleById';
import updateViews from '@salesforce/apex/YotiSupportSiteViewHandler.updateViews';

import getRelatedArticles from '@salesforce/apex/YotiSupportSiteController.getRelatedArticle';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import DNMC from '@salesforce/messageChannel/DesktopNavigationMessageChannel__c';


export default class FaqPage extends LightningElement {

    faqBody = ''
    rightIconT =  righticon;
    businessSupport = IMAGES + '/businessSupport.png';

    type = null
    product = null
    articleId = null
    category = null
    formattedDate = ''
    @track relatedData = []
    subscription = null;
    @track isMobileNavigation=false;
    
    pageLink = ''
    pageLinkWithProduct = ''
    receivedMessage;
    @wire(MessageContext)
        messageContext;

    async connectedCallback(){
        
        let url = new URL(window.location.href);
        this.type = url.searchParams.get('type');
        this.product = url.searchParams.get('product');
        this.articleId = url.searchParams.get('articleId');
        this.category = url.searchParams.get('category');

        if(this.type == 'Individuals'){
           this.pageLink = '/yotiSupportSite/individuals-page?type=Individuals'
           this.pageLinkWithProduct = '/yotiSupportSite/category?type=Individuals&product='+this.product
        }else{
            this.pageLink = '/yotiSupportSite/businesses-page?type=Businesses'
            this.pageLinkWithProduct = '/yotiSupportSite/category?type=Businesses&product='+this.product
        }

        if(this.type == null || this.type == undefined || this.type == '' || this.product == null || this.product == undefined || this.product == '' || this.articleId == null || this.articleId == undefined || this.articleId == '' || this.category == null || this.category == undefined || this.category == ''){
            window.location.href = '/yotiSupportSite/error-page';
        }      

        console.log('type: 22' , this.type,this.product,this.articleId,this.category);
        
        

        await getArticle({id: this.articleId})
        .then(result => {
            console.log('result111: ' , result);
            if(result.length > 0){
                this.faqBody = result[0].Answer__c
                this.articleData = result[0]
                const dateString = result[0].LastPublishedDate;
                const countID = result[0].KnowledgeArticleId;
                const date = new Date(dateString);
                const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure 2 digits (e.g., 05 instead of 5)
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
                const year = date.getUTCFullYear();
                this.formattedDate = `${day}/${month}/${year}`;
                console.log('count : ' , countID);
                if((this.articleId != null && this.articleId != undefined && this.articleId != '') && (countID != null && countID!= undefined && countID != '')){
                    let value = sessionStorage.getItem(this.articleId);
                    console.log('value: ' , value);
                    if(!value){
                        sessionStorage.setItem(this.articleId,this.articleId)
                        updateViews({id: countID})
                        .then(result => {
                            console.log('Updated Count: ');
                                                    })
                        .catch(error => {
                            console.log('error updateViews: ' , error);});
                    }
                  }
                
            }
            
        })
        .catch(error => {
            console.log('error:getArticle ' , error);});

        await getRelatedArticles({subCategory: this.category,product: this.product})
            .then(result => {
                console.log('result111: ' , result);
                if(result.length > 0){
                    this.relatedData = JSON.parse(JSON.stringify(result));
                    console.log(`this.relatedData: ` ,JSON.stringify(this.relatedData));
                }
                
            })
            .catch(error => {
                console.log('error: getRelatedArticles ' , error);});    

        this.subscription = subscribe(this.messageContext, HMC, (message) => {
                this.handleMessage(message);
        });
    }

    handleMessage(message) {
        this.receivedMessage = message.messageText;
        if (this.receivedMessage === 'Hamburger Clicked' || this.receivedMessage === 'Search Icon Clicked') {
            this.isMobileNavigation = true;
        } else {
            this.isMobileNavigation = false;
        }
    }
    
    renderedCallback() {
        console.log('renderedCallback');
        const richTextContainer = this.template.querySelector('.flexcontainer');
        
        if (richTextContainer && this.faqBody) {
            // Insert the rich text data as innerHTML
            richTextContainer.innerHTML = this.faqBody;
            const spans = richTextContainer.querySelectorAll('span');
            spans.forEach(span => {
                span.style.fontFamily = 'inherit';  // Inherit font family from outer container
                span.style.fontSize = '18px';
                span.style.color = '#546072 !important';    // Inherit font size from outer container
            });
        }

        const richTextContainerTemp = this.template.querySelector('.title');
        console.log('this.articleData: ' , JSON.stringify(this.articleData));
        if (richTextContainer && this.articleData) {
            // Insert the rich text data as innerHTML
            const sanitizedHTML = this.articleData.Question__c.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
            richTextContainerTemp.innerHTML = sanitizedHTML;
        }   
    }

    handleClick(event){
        console.log('event: ' , event.target.dataset.id);
        const articleId = event.target.dataset.id;
        if(articleId && this.category && this.type && this.product){    
            console.log('articleId: ' , articleId);
            console.log('category: ' , this.category);
            window.location.href = '/yotiSupportSite/article-detail?type='+this.type+'&product='+this.product+'&articleId='+articleId+'&category='+this.category;    
        }
    }

    handleType(){
        
        publish(this.messageContext, DNMC, {
         messageText: (this.type).toLowerCase()
        });
    }

    handleProduct(){
       console.log('this.product: ***' , this.product);
       
       publish(this.messageContext, DNMC, {
        messageText: (this.type).toLowerCase()
       });
    }
}