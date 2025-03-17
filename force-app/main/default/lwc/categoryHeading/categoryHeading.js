import { LightningElement,wire } from 'lwc';
import righticon from '@salesforce/resourceUrl/rightIcon';
import searchKnowledgeArticles from '@salesforce/apex/YotiSupportSiteController.searchKnowledgeArticles';
import { CurrentPageReference } from 'lightning/navigation';


export default class CategoryHeading extends LightningElement {
    rightIconT =  righticon;
    type = ''
    product = ''
    
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
            this.type = currentPageReference.state?.type;
             this.product = currentPageReference.state?.product;
       }
    }

    connectedCallback() {
        // Get the query string from the URL
        const urlParams = new URLSearchParams(window.location.search);

        // Fetch specific parameters
        this.type = urlParams.get('type'); // Returns 'value1'
        this.product = urlParams.get('product'); // Returns 'value2'

        if(this.type == null){
            this.type = 'Dummy';
        }
        if(this.product == null){
            this.product = 'Dummy';
        }

        console.log('param1:', this.param1Value);
        console.log('param2:', this.param2Value);
    }



}