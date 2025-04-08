global with sharing class YotiSupportSiteController {
        @AuraEnabled(cacheable=true)
        global static List<Knowledge__kav> searchKnowledgeArticles(String searchKeyword) {
            // Ensure searchKeyword is not null to prevent SOQL errors
            if (String.isEmpty(searchKeyword)) {
                return new List<Knowledge__kav>();
            }
    
            String searchPattern = '%' + searchKeyword + '%';
    
            try {
                List<Knowledge__kav> articles = [
                    SELECT Id, Title, ArticleNumber, UrlName, Lastpublisheddate,PublishStatus,Sub_Category__c,Topic__c,Sub_Topic__c, Question__c,Answer__c
                    FROM Knowledge__kav
                    WHERE Title LIKE :searchPattern
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US'
                    WITH DATA CATEGORY YOTI_FAQs__c AT (ALL__c)
                ];
                return articles;
            } catch (Exception e) {
                System.debug('Error fetching Knowledge Articles: ' + e.getMessage());
                return new List<Knowledge__kav>();
            }
        }


        @AuraEnabled(cacheable=true)
        global static List<Knowledge__kav> getArticles(String type,String product) {
            if (String.isEmpty(product) || String.isEmpty(type)) {
                return new List<Knowledge__kav>();
            }
            type = '%' + type + '%';
    
           System.debug('type'+type+'>>>'+product);
            try {
                List<Knowledge__kav> articles = [
                    SELECT Id, Title, ArticleNumber, UrlName, PublishStatus,Sub_Category__c
                    FROM Knowledge__kav
                    WHERE Topic__c like :type 
                    AND Sub_Topic__c =:product
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US'
                    WITH DATA CATEGORY YOTI_FAQs__c AT (ALL__c)
                ];
                return articles;
            } catch (Exception e) {
                System.debug('Error fetching Knowledge Articles: ' + e.getMessage());
                return new List<Knowledge__kav>();
            }
        }

        @AuraEnabled
        global static List<Knowledge__kav> getArticleById(String id) {
            if (String.isEmpty(id)) {
                return new List<Knowledge__kav>();
            }
          
    
           System.debug('id'+id);
            try {
                List<Knowledge__kav> articles = [
                    SELECT Id, Title, Lastpublisheddate,knowledgeArticleId, PublishStatus,Sub_Category__c, Question__c,Answer__c
                    FROM Knowledge__kav
                    WHERE Id = :id
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US'
                ];
                return articles;
            } catch (Exception e) {
                System.debug('Error fetching Knowledge Articles: ' + e.getMessage());
                return new List<Knowledge__kav>();
            }

        }
        
        
        private static List<Knowledge__kav> getRandomKnowledgeRecords(List<Knowledge__kav> knowledgeList) {
            if (knowledgeList == null || knowledgeList.isEmpty()) {
                return new List<Knowledge__kav>(); // Return an empty list if input is null/empty
            }
    
            Integer listSize = knowledgeList.size();
            
            if (listSize <= 6) {
                return knowledgeList; // If 6 or fewer records exist, return them all
            }
    
            // Shuffle the list using Fisher-Yates algorithm
            Integer currentIndex = listSize;
            Integer randomIndex;
            Knowledge__kav tempRecord;
    
            while (currentIndex > 1) {
                randomIndex = Math.floor(Math.random() * currentIndex).intValue();
                currentIndex--;
    
                // Swap elements
                tempRecord = knowledgeList[currentIndex];
                knowledgeList[currentIndex] = knowledgeList[randomIndex];
                knowledgeList[randomIndex] = tempRecord;
            }
    
            // Extract the first 6 shuffled records manually
            List<Knowledge__kav> random6Records = new List<Knowledge__kav>();
            for (Integer i = 0; i < 6; i++) {
                random6Records.add(knowledgeList[i]);
            }
    
            return random6Records;
        }
    

        @AuraEnabled
        global static List<Knowledge__kav> getRelatedArticle(String subCategory) {
            if (String.isEmpty(subCategory)) {
                return new List<Knowledge__kav>();
            }
          
    
           System.debug('subCategory '+subCategory);
            try {
                List<Knowledge__kav> articles = [
                    SELECT Id, Title, PublishStatus,Sub_Category__c
                    FROM Knowledge__kav
                    WHERE Sub_Category__c = :subCategory
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US' limit 100
                ];
                return getRandomKnowledgeRecords(articles);
                
            } catch (Exception e) {
                System.debug('Error fetching Knowledge Articles: ' + e.getMessage());
                return new List<Knowledge__kav>();
            }

        }

        @AuraEnabled(cacheable=true)
        public static List<Knowledge__kav> getTopFAQItems(String topic) {
            if(topic=='Business'){
                topic='For Businesses';
            }else if(topic=='Individual'){
                topic='For Individuals';
            }
            return [
                SELECT Id,Title,Question__c,Topic__c,Sub_Topic__c,Sub_Category__c
                FROM Knowledge__kav
                WHERE PublishStatus = 'Online' AND Language = 'en_US'
                AND Topic__c = :topic
                ORDER BY View_Count_for_LWR__c DESC
                LIMIT 5
            ];
        }
}