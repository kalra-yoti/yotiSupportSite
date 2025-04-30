import { LightningElement,wire,track } from 'lwc';
import righticon from '@salesforce/resourceUrl/rightIcon';
import IMAGES from '@salesforce/resourceUrl/Images';
import WEBACCOUNTIMAGE from '@salesforce/resourceUrl/Image_web_account';
import PASSMANAGERIMAGE from '@salesforce/resourceUrl/Image_password_manager';
import HEADERIMAGE from '@salesforce/resourceUrl/Image_individuals_support';
import searchKnowledgeArticles from '@salesforce/apex/YotiSupportSiteController.searchKnowledgeArticles';
//import { CurrentPageReference } from 'lightning/navigation';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import HMC from '@salesforce/messageChannel/HamburgerMessageChannel__c';
import DNMC from '@salesforce/messageChannel/DesktopNavigationMessageChannel__c';


export default class CategoryHeading extends LightningElement {
    rightIconT =  righticon;
    type = ''
    product = ''

    buildingImage = IMAGES + '/icon_attributes_office_building.png';
    trustImageTemp = HEADERIMAGE;
    esignImage = IMAGES + '/esign.png';
    ageVerification=IMAGES+'/ageVerification.png';
    marketingHealthImage = IMAGES + '/icon_marketing_health.png';
    iconPasswordManager = IMAGES + '/iconPasswordManager.png';
    webAccountImage = WEBACCOUNTIMAGE;
    iconPasswordManagerImage = PASSMANAGERIMAGE;

    image = null

    isBusiness = false;
    subscription = null;
    @track isMobileNavigation=false;

    receivedMessage;
    pageLink = ''

    @wire(MessageContext)
    messageContext;
    
    /*@wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
            this.type = currentPageReference.state?.type;
             this.product = currentPageReference.state?.product;


        if(this.type == 'Business'){
            this.isBusiness = true;
        }else{
            this.isBusiness = false
        }
        console.log('isBusiness', this.isBusiness);
       }
    }*/


    setImage(text) {
        if(text == 'Yoti Hub')
            this.image = this.trustImageTemp
        else if(text == 'Yoti Identity Verification Portal')
            this.image = this.trustImageTemp
        else if(text == 'eSignatures')
            this.image = this.esignImage
        else if(text == 'ageVerification')
            this.image = this.ageVerification
        else if(text == 'Yoti app')
            this.image = this.trustImageTemp
        else if(text == 'Identity Verification')
            this.image = this.webAccountImage
        else if(text == 'Web account')
            this.image = this.webAccountImage
        else if(text == 'Yoti password manager')
            this.image = this.iconPasswordManagerImage
        else
            this.image = ''
        
        
    }
    connectedCallback() {
        // Get the query string from the URL
        const urlParams = new URLSearchParams(window.location.search);

        // Fetch specific parameters
        this.type = urlParams.get('type'); // Returns 'value1'
        this.product = urlParams.get('product'); // Returns 'value2'
        if(this.product)
            this.setImage(this.product);

        if(this.type == 'Business'){
           this.pageLink = '/yotiSupportSite/businesses-page?type=Business'
         }else{
            this.pageLink = '/yotiSupportSite/individuals-page?type=Individual'
         }
        
        console.log('param1:', this.type,JSON.stringify(window.location));
        console.log('param2: Header', this.product,this.image);
        
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


    handleRedirect(event){


        const articleId = event.currentTarget.dataset.articleId;
        
        
        
        console.log('articleId:', articleId);
        
        publish(this.messageContext, DNMC, {
            messageText: (this.type).toLowerCase()
        });
    }


}