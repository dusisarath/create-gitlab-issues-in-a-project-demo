GitLabIssueCreation.controller('MainController', ['$scope', 'MigrationService', '$timeout', function($scope, MigrationService, $timeout) {
       $scope.data = {
    		   login_id : null,
    		   passwd : null,
    		   user_name : null,
    		   project_name : null,
    		   title : null,
    		   issue_description : null,
    		   labels : null,
    		   milestone : null,
    		   projectId : null,
    		   sessionToken : null,
    		   milestone_id : null
    }
       
       $scope.showIssueCreationCompleteMsg = false;
       $scope.creationInProgress = false;
       $scope.issueCreationCompleteMsg = null;
       $scope.urlToCreatedIssue = null,
	   $scope.confidential = false;	   
       $scope.showProgressMessage = false;

       $scope.createIssue = function() {
    	   MigrationService.createIssue($scope.data).then(
    			   function(value) {
    				   $scope.showProgressMessage = true;
    	    		   $scope.showIssueCreationCompleteMsg = true;
    				   $scope.creationInProgress = false;
    				   $scope.confidential = value.confidential;
    				   if(!$scope.confidential && value.web_url) {
    					   $scope.urlToCreatedIssue = value.web_url;
    					   $scope.issueCreationCompleteMsg = "Created an issue in" + $scope.data.project_name;
    				   } else {
        		    	   $scope.creationInProgress = false;
        		    	   $scope.showIssueCreationCompleteMsg = true;
    					   $scope.issueCreationCompleteMsg = "Unable to create an issue in project: " + $scope.data.project_name + ". Project doesn't exist. Enter a valid project name.";
        				   $scope.showProgressMessage = false;
    				   }
    			   },
    			   function(response) {
    		    	   $scope.creationInProgress = false;
    		    	   $scope.showIssueCreationCompleteMsg = false;
					   $scope.issueCreationCompleteMsg = "Unable to create an issue in project: " + $scope.data.project_name + ". Project doesn't exist. Enter a valid project name.";
    				   $scope.showProgressMessage = false;
    			   }
    		);
       }
       
       
       $scope.fetchMilestoneId = function () {
    	   var milestoneExists = false;
    	   MigrationService.fetchMilestoneId($scope.data).then(
    			   function(value) {
    				   if(value) {
    					   for(var i = 0; i < value.length; i++) {
    						   if(value[i].title === $scope.data.milestone) {
    							   $scope.data.milestone_id = value[i].id;
    							   milestoneExists = true;
    						   } 
    					   }
    					   if(!milestoneExists) {
    						   // create milestone first and then create the issue
    				    	   MigrationService.createMilestone($scope.data).then(
    				    			   function(value) {
    				    				   $scope.data.milestone_id = value.id;
    			    					   $scope.createIssue();    				    				   
    				    			   },
    				    			   function(response) {
    				    		    	   $scope.creationInProgress = false;
    				    		    	   $scope.showIssueCreationCompleteMsg = false;
    									   $scope.issueCreationCompleteMsg = "Unable to create milestone in project: " + $scope.data.project_name;
    				    				   $scope.showProgressMessage = false;    				    				   
    				    			   }
    				    	   );

    					   } else {
    						   $scope.createIssue(); // create issue if milestone already exists
    					   }
    				   }
    			   },
    			   function(response) {
    				   
    			   }
    	   );
       }
       
       $scope.fetchProjectId = function () {
           MigrationService.fetchProjectId($scope.data).then(
    			   function(value) {
    				   if (value && value.id) {
        				   $scope.data.projectId = value.id;
        				   $scope.fetchMilestoneId(); 
    				   } else {
        		    	   $scope.creationInProgress = false;
        		    	   $scope.showIssueCreationCompleteMsg = true;
        				   $scope.showProgressMessage = false;
    					   $scope.issueCreationCompleteMsg = "Project doesn't exist. Unable to create an issue in project: " + $scope.data.project_name;
    				   }
    			   },
    			   function(response) {
    		    	   $scope.creationInProgress = false;
    		    	   $scope.showIssueCreationCompleteMsg = false;
    				   $scope.showProgressMessage = false;
					   $scope.issueCreationCompleteMsg = "Project doesn't exist. Unable to create an issue in project: " + $scope.data.project_name;
    			   }
    	   );
       }
       
       $scope.startSession = function() {
    	   $scope.creationInProgress = true;
    	   $scope.showIssueCreationCompleteMsg = false;
           $scope.urlToCreatedIssue = null;
           $scope.issueCreationCompleteMsg = null;
           
           MigrationService.fetchPrivateToken($scope.data).then(
        		   function(value) {
        			   if(value && value.private_token) {
            			   $scope.data.sessionToken = value.private_token;
            			   $scope.fetchProjectId();        				   
        			   } else {
        		    	   $scope.creationInProgress = false;
        		    	   $scope.showIssueCreationCompleteMsg = true;
    					   $scope.issueCreationCompleteMsg = "Invalid login credentials. Unable to fetch the project details for project: " + $scope.data.project_name + ". Please enter valid credentials.";
        				   $scope.showProgressMessage = false;
        			   }
        		   },
        		   function(response) {
    		    	   $scope.creationInProgress = false;
    		    	   $scope.showIssueCreationCompleteMsg = false;
					   $scope.issueCreationCompleteMsg = "Invalid login credentials. Unable to fetch the project details for project: " + $scope.data.project_name + ". Please enter valid credentials.";
    				   $scope.showProgressMessage = false;
        		   }
           );
       }
       
       $scope.updateUserName = function () {
    	   if ($scope.data.login_id != null) {
    		   var index = $scope.data.login_id.indexOf('@');
    		   if (index > -1) {
    			   $scope.data.user_name = $scope.data.login_id.substring(0,index);
    		   } else {
    			   $scope.data.user_name = new String($scope.data.login_id);
    		   }
    	   } else {
			   $scope.data.user_name = $scope.data.login_id;
    	   }
       }       
}]); 
  

