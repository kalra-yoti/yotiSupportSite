import { LightningElement,wire } from 'lwc';
import righticon from '@salesforce/resourceUrl/rightIcon';
import IMAGES from '@salesforce/resourceUrl/Images';
import HEADERIMAGE from '@salesforce/resourceUrl/Image_individuals_support';
import searchKnowledgeArticles from '@salesforce/apex/YotiSupportSiteController.searchKnowledgeArticles';
import { CurrentPageReference } from 'lightning/navigation';


export default class CategoryHeading extends LightningElement {
    rightIconT =  righticon;
    type = ''
    product = ''

    buildingImage = IMAGES + '/icon_attributes_office_building.png';
    trustImageTemp = HEADERIMAGE;
    isBusiness = false;
    
    @wire(CurrentPageReference)
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
    }

    connectedCallback() {
        // Get the query string from the URL
        const urlParams = new URLSearchParams(window.location.search);

        // Fetch specific parameters
        this.type = urlParams.get('type'); // Returns 'value1'
        this.product = urlParams.get('product'); // Returns 'value2'


        console.log('param1:', this.param1Value);
        console.log('param2:', this.param2Value);
    }


    handleRedirect(event){
        const articleId = event.currentTarget.dataset.articleId;
        console.log('articleId:', articleId);
        if(this.type == 'Business'){
           window.location.href = '/yotiSupportSite/businesses-page'
        }else{
            window.location.href = '/yotiSupportSite/individuals-page'
        }
    }


}