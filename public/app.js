'use strict';

/* App Module */

var GitLabIssueCreation = angular.module('GitLabIssueCreation', ['restangular']);
  
GitLabIssueCreation.config(['RestangularProvider',
             function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/rest');
}])

GitLabIssueCreation.factory('MigrationService', ['Restangular', 
       function(Restangular) {
	
    var fetchProjectId = function(data) {
    	var params = {user_name: data.user_name, project_name : data.project_name, sessionToken:data.sessionToken};
    	var project = Restangular.one('projects', 'id');
    	return project.customGET("", params);
    };
    
    var fetchPrivateToken = function(data) {
    	var project = Restangular.all('session');
    	return project.customPOST(data);
   };
    
    var createIssue = function(data) {
    	var project = Restangular.one('projects', 'id');
    	return project.customPOST(data, 'issues');
    };
    
    var fetchMilestoneId = function(data) {
    	var params = {projectId: data.projectId, sessionToken:data.sessionToken};
    	var project = Restangular.one('projects', 'id');
    	return project.customGET('milestones', params);
    }

    var createMilestone = function(data) {
    	var project = Restangular.one('projects', 'id');
    	return project.customPOST(data, 'milestones');
    };

    return {
    	fetchProjectId : fetchProjectId,
    	fetchPrivateToken : fetchPrivateToken,
    	createIssue : createIssue,
    	fetchMilestoneId : fetchMilestoneId,
    	createMilestone : createMilestone
    };
}])
