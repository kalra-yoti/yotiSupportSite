import { LightningElement,wire } from 'lwc';
import getArticle from '@salesforce/apex/YotiSupportSiteController.getArticles';
import { CurrentPageReference } from 'lightning/navigation';

export default class Category extends LightningElement {

    topicLink = [];
    
    titleLink = [];
    
    topicList = [];


   type = ''
   product = ''
   isBusiness = ''

 
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
    //this.transformData();
    console.log('type: ' , this.type);
    console.log('product: ' , this.product);  

   }

   transformData(inputData) {
    
    console.log('inputData: ' , JSON.stringify(inputData));
    // Transform the data to display all keys and their values
    this.topicList = Object.keys(inputData).map((key, index) => ({
        id: 'topic'+index+''+index,
        dataId: 'topic'+index+''+index+''+index,
        name: key,
        titleLink: inputData[key].map((value, valueIndex) => ({
            id: value.id,
            name: value.title
        }))
    }));
}

    
    getKArticle(type,product){
        getArticle({type:type,product:product})
        .then(result => {
            console.log('result: ' , JSON.stringify(result));

           let topicLinkList = []
           let titleLinkObject = {}
           this.titleLink = []


            result.forEach(element => {
                console.log('element: ' , JSON.stringify(element));
                if(!topicLinkList.includes(element.Sub_Category__c)){
                    topicLinkList.push(element.Sub_Category__c);
                }
                
                if(!titleLinkObject.hasOwnProperty(element.Sub_Category__c)){
                    titleLinkObject[element.Sub_Category__c] = [{'title':element.Title,'id':element.Id}];
                }else{
                    let temp = titleLinkObject[element.Sub_Category__c]
                    temp.push({'title':element.Title,'id':element.Id});
                    titleLinkObject[element.Sub_Category__c] = temp
                }

            //    this.titleLink.push({'id':element.Id,'name':element.Title});
            });

           // this.topicList = [];
            this.topicLink = [];
            console.log('topicLinkList: ' , JSON.stringify(topicLinkList));
            for(let i=0;i<topicLinkList.length;i++){
             //   this.topicList.push({'id':'topic'+i+''+i,'name':topicLinkList[i],'dataId':''+i+''+i+''+i});
                this.topicLink.push({'id':'topic'+i,'name':topicLinkList[i]});
            }
            console.log('topicList: ' , JSON.stringify(this.topicList));
            console.log('topicLink: ' , JSON.stringify(this.topicLink));
            this.transformData(titleLinkObject);
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

    handleArticle(event){
        console.log('event: ' , event.target.id);

        let articleId = event.target.id.split('-')[0]
        let category = event.currentTarget.dataset.id;
        console.log('articleId: ' , articleId);
            console.log('category: ' , category);
        if(articleId && category){
            console.log('articleId: ' , articleId);
            console.log('category: ' , category);
            window.location.href = '/yotiSupportSite/article-detail?type='+this.type+'&product='+this.product+'&articleId='+articleId+'&category='+category;    
        }
    }
           
}