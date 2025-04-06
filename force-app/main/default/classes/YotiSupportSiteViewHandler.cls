global without sharing class YotiSupportSiteViewHandler {
    @AuraEnabled
        global static void updateViews(String id) {
            try {
                System.debug('ssss '+id);
                if(String.isNotBlank(id)) {
                    List<Article_Views__c> article = [Select Knowledge_Article_Id__c,Article_View_Count__c from Article_Views__c where Knowledge_Article_Id__c =: id];
                    if(article.size() > 0) {
                       System.debug('article[0].Article_View_Count__c'+article[0].Article_View_Count__c+'>>>>  '+id );

                        article[0].Article_View_Count__c = article[0].Article_View_Count__c + 1;
                        update article[0];
                         System.debug('ssss ');
                    } 
                }
                
            } catch (Exception e) {
                System.debug('Error updating article views ' + e.getMessage());
            }

        }
}