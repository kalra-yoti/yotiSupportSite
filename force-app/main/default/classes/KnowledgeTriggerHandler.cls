public class KnowledgeTriggerHandler {
	
    public static void createViewRecord(Map<Id,Knowledge__kav> mapOfArticle){
      	
        List<Id> lsOfId = new  List<Id>();
        List<Article_Views__c> avcList = new List<Article_Views__c>();
        
        for(Article_Views__c  avc : [Select Knowledge_Article_Id__c , Article_View_Count__c from Article_Views__c where Knowledge_Article_Id__c IN :mapOfArticle.keySet()]){
           lsOfId.add(avc.Knowledge_Article_Id__c); 
        }
        
        for(Id idTemp : mapOfArticle.keySet()){
            if(!lsOfId.contains(idTemp)){
                Article_Views__c  avcTemp = new Article_Views__c();
                avcTemp.Knowledge_Article_Id__c = idTemp;
                avcTemp.Article_View_Count__c = 0;
                avcList.add(avcTemp);
            } 
        }
        
        if(avcList.size()>0){
            insert avcList; 
        }
        
    }
    
}