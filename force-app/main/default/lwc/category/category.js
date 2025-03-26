import { LightningElement,wire } from 'lwc';
import getArticle from '@salesforce/apex/YotiSupportSiteController.getArticles';
import { CurrentPageReference } from 'lightning/navigation';

export default class Category extends LightningElement {

    topicLink = [
        { 'id': 'topic1', 'name': 'Topic 1' },
        { 'id': 'topic2', 'name': 'Topic 2' },
        { 'id': 'topic3', 'name': 'Topic 3' },
        { 'id': 'topic4', 'name': 'Topic 4' }
    ];
    
    titleLink = [
        { 'id': 1, 'name': 'This is the title of an article 1' },
        { 'id': 2, 'name': 'This is the title of an article 2' },
        { 'id': 3, 'name': 'This is the title of an article 3' },
        { 'id': 4, 'name': 'This is the title of an article 4' }
    ];
    
    topicList = [
        { 'id': 'topic11', 'name': 'Topic 1','dataId':'topic111' },
        { 'id': 'topic22', 'name': 'Topic 2','dataId':'topic222' },
        { 'id': 'topic33', 'name': 'Topic 3','dataId':'topic333' },
        { 'id': 'topic44', 'name': 'Topic 4','dataId':'topic444' }
    ];


   type = ''
   product = ''
   isBusiness = ''

 /*@wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
            this.type = currentPageReference.state?.type;
             this.product = currentPageReference.state?.product;


        
        console.log('isBusiness', this.isBusiness);
       }
    }*/


  async connectedCallback(){


   
    let url = new URL(window.location.href);
    console.log('url: ' , JSON.stringify(url));
     this.type = url.searchParams.get('type');
     this.product = url.searchParams.get('product');

     console.log('type: ' , this.type,this.product);
    if(this.type == 'Business'){
        this.isBusiness = true;
    }else{
        this.isBusiness = false
    }

    await this.getKArticle(this.type,this.product);
    console.log('type: ' , this.type);
    console.log('product: ' , this.product);  

   }

    
  async getKArticle(type,product){
        getArticle({type:type,product:product})
        .then(result => {
            console.log('result: ' , JSON.stringify(result));

           let topicLinkList = []
           let titleLinkObject = {}
           this.titleLink = []


            result.forEach(element => {
                console.log('element: ' , JSON.stringify(element));
                if(!topicLinkList.includes(element.Sub_Category__c))
                    topicLinkList.push(element.Sub_Category__c);

                this.titleLink.push({'id':element.Id,'name':element.Title});
            });

            this.topicList = [];
            this.topicLink = [];
            console.log('topicLinkList: ' , JSON.stringify(topicLinkList));
            for(let i=0;i<topicLinkList.length;i++){
                this.topicList.push({'id':'topic'+i+''+i,'name':topicLinkList[i],'dataId':''+i+''+i+''+i});
                this.topicLink.push({'id':'topic'+i,'name':topicLinkList[i]});
            }
            console.log('topicList: ' , JSON.stringify(this.topicList));
            console.log('topicLink: ' , JSON.stringify(this.topicLink));
        })
        .catch(error => {
            console.log('error: ' , JSON.stringify(error))
        });
    }



    // Scroll to the section when a link is clicked
   handleScroll(event) {
        const topicId = event.currentTarget.dataset.topicId;
        let number = topicId.match(/\d+/)[0];
        number = 'topic'+number+''+number+''+number;
        console.log(number);  // Output: "44"               

        const targetSection = this.template.querySelector('.'+number);
        
        console.log('targetSection: ' , JSON.stringify(targetSection),topicId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
       
    }
           
}