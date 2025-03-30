import { LightningElement,track } from 'lwc';

import righticon from '@salesforce/resourceUrl/rightIcon';
import IMAGES from '@salesforce/resourceUrl/Images';
import { CurrentPageReference } from 'lightning/navigation';
import getArticle from '@salesforce/apex/YotiSupportSiteController.getArticleById';

import getRelatedArticles from '@salesforce/apex/YotiSupportSiteController.getRelatedArticle';


export default class FaqPage extends LightningElement {

    faqBody = ''
    rightIconT =  righticon;
    businessSupport = IMAGES + '/businessSupport.png';

    type = ''
    product = ''
    articleId = ''
    category = ''
    formattedDate = ''
    @track relatedData = []

    async connectedCallback(){
        let url = new URL(window.location.href);
        console.log('url: ' , JSON.stringify(url));
        this.type = url.searchParams.get('type');
        this.product = url.searchParams.get('product');
        this.articleId = url.searchParams.get('articleId');
        this.category = url.searchParams.get('category');
        console.log('type: 22' , this.type,this.product,this.articleId,this.category);
        
        await getArticle({id: this.articleId})
        .then(result => {
            console.log('result111: ' , result);
            if(result.length > 0){
                this.faqBody = result[0].Answer__c
                this.articleData = result[0]
                const dateString = result[0].LastPublishedDate;
                const date = new Date(dateString);
                const day = String(date.getUTCDate()).padStart(2, '0'); // Ensure 2 digits (e.g., 05 instead of 5)
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
                const year = date.getUTCFullYear();
                this.formattedDate = `${day}/${month}/${year}`;
            }
            
        })
        .catch(error => {
            console.log('error: ' , error);});

        await getRelatedArticles({subCategory: this.category})
            .then(result => {
                console.log('result111: ' , result);
                if(result.length > 0){
                    this.relatedData = JSON.parse(JSON.stringify(result));
                    console.log(`this.relatedData: ` ,JSON.stringify(this.relatedData));
                }
                
            })
            .catch(error => {
                console.log('error: ' , error);});    
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
                span.style.color = '#546072';    // Inherit font size from outer container
            });
        }

        const richTextContainerTemp = this.template.querySelector('.title');
        if (richTextContainer && this.articleData) {
            // Insert the rich text data as innerHTML
            richTextContainerTemp.innerHTML = this.articleData.Question__c;
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
        if(this.type == 'Individuals'){
             window.location.href = '/yotiSupportSite/individuals-page'
       }else{
            window.location.href = '/yotiSupportSite/businesses-page'
       }
    }

    handleProduct(){
        console.log('this.product: ***' , this.product);
       if(this.type == 'Individuals'){
             window.location.href = '/yotiSupportSite/category?type=Individuals&product='+this.product
       }else{
            window.location.href = '/yotiSupportSite/category?type=Businesses&product='+this.product
       }
    }
}