trigger KnowledgeTrigger on Knowledge__kav (after insert) {
	
    Map<Id,Knowledge__kav> mapArticle = new  Map<Id,Knowledge__kav>();
   
    for(Knowledge__kav kaTemp: Trigger.new){
        if(String.isNotBlank(kaTemp.Topic__c) &&  String.isNotBlank(kaTemp.Sub_Topic__c )){
            mapArticle.put(kaTemp.knowledgeArticleId,kaTemp);
        }
    }
    
    if(!mapArticle.isEmpty())
   	  KnowledgeTriggerHandler.createViewRecord(mapArticle);
}