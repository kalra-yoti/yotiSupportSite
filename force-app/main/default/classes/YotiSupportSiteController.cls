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
                    SELECT Id, Title, ArticleNumber, UrlName, PublishStatus,Sub_Category__c, Question__c,Answer__c
                    FROM Knowledge__kav
                    WHERE Title LIKE :searchPattern
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US'
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
                    SELECT Id, Title, ArticleNumber, UrlName, PublishStatus,Sub_Category__c, Question__c,Answer__c
                    FROM Knowledge__kav
                    WHERE Topic__c like :type 
                    AND Sub_Topic__c =:product
                    AND PublishStatus = 'Online'
                    AND Language = 'en_US'
                ];
                return articles;
            } catch (Exception e) {
                System.debug('Error fetching Knowledge Articles: ' + e.getMessage());
                return new List<Knowledge__kav>();
            }
        }

    //     @AuraEnabled
    //     global static List<FAQWrapper> getKnowledgeArticles() {
        
    //     List<FAQWrapper> faqWrappers = new List<FAQWrapper>();

    //     // Query to get knowledge articles along with LastModifiedDate
    //     List<Knowledge__kav> knowledgeArticles = [
    //         SELECT Id, Title, Summary, Answer__c, LastModifiedDate 
    //         FROM Knowledge__kav 
    //         WHERE PublishStatus = 'Online' AND Language = 'en_US'
    //     ];

    //     // Get topic assignments for the knowledge articles
    //     Map<Id, List<String>> articleTopicsMap = new Map<Id, List<String>>();
        
    //     List<TopicAssignment> topicAssignments = [
    //         SELECT EntityId, Topic.Name 
    //         FROM TopicAssignment 
    //         WHERE EntityId IN :knowledgeArticles 
    //     ];

    //     // Group topics by knowledge article
    //     for (TopicAssignment ta : topicAssignments) {
    //         if (!articleTopicsMap.containsKey(ta.EntityId)) {
    //             articleTopicsMap.put(ta.EntityId, new List<String>());
    //         }
    //         articleTopicsMap.get(ta.EntityId).add(ta.Topic.Name);
    //     }

    //     // Process knowledge articles
    //     for (Knowledge__kav article : knowledgeArticles) {
    //         String category = 'Uncategorized';
    //         String solution = 'None';
    //         List<String> topics = articleTopicsMap.get(article.Id);

    //         if (topics != null && !topics.isEmpty()) {
    //             if (topics.size() == 1) {
    //                 category = topics[0];
    //             } else {
    //                 // Identify Business/Individual category and solution
    //                 for (String topic : topics) {
    //                     if (topic == 'For Business' || topic == 'For Individual') {
    //                         category = topic;
    //                     } else {
    //                         solution = topic;
    //                     }
    //                 }
    //             }
    //         }

    //         // Add to wrapper list
    //         faqWrappers.add(new FAQWrapper(
    //             article.Id,
    //             article.Title,
    //             article.Summary,
    //             category,
    //             solution,
    //             article.LastModifiedDate // Assign LastModifiedDate
    //         ));
    //     }

    //     return faqWrappers;
    // }


    //     global class FAQWrapper {
    //         // Define properties for the wrapper class
    //         @AuraEnabled
    //         global String id;
    //         @AuraEnabled
    //         global String title;
    //         @AuraEnabled
    //         global String description;
    //         @AuraEnabled
    //         global String category;
    //         @AuraEnabled
    //         global String solution;
    //         @AuraEnabled
    //         global DateTime dateF;
        
    //         // Constructor for the wrapper class
    //         global FAQWrapper(String id,String title,String description,String category,String solution,DateTime dateF) {
    //             this.id = id;
    //             this.title = title;
    //             this.description = description;
    //             this.category = category;
    //             this.solution = solution;
    //             this.dateF = dateF;
    //         }
    //     }
    }