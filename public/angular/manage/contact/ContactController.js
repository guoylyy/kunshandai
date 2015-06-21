define(['app','underscore'], function(app,_) {
  return app.controller('ContactController', ['$scope', 'contacts', 'SweetAlert', '$modal', 'ContactService', '$state', '$stateParams',
    function($scope, contacts, SweetAlert, $modal, ContactService, $state, $stateParams) {
      $scope.currentState = $state.current;

      if($scope.currentState.name.split('.')[1] == 'contact'  ) {
        $scope.contacts = contacts.values;

        $scope.currPage = $stateParams.page || 1;
        $scope.totalNum = contacts.totalNum;
        $scope.pageSize = contacts.pageSize;
      }else if($scope.currentState.name.split('.')[1] == 'searchContact'){
        $scope.contacts = contacts;
      }

      $scope.search = {
        type: {
          text: '',
          value: ''
        },
        keyword: ''
      };

      $scope.$watch('search',function(){
        if($stateParams.keyword){
          $scope.search.keyword = $stateParams.keyword;
        }
        if($stateParams.type){
          $scope.changeSearchType($stateParams.type);
        }else{
          $scope.changeSearchType('name');
        }
      })

      $scope.view = function(contactId, controlName) {
        openContactModal(contactId, 'view');
      }

      $scope.edit = function(contactId, controlName) {
        openContactModal(contactId, 'edit');
      }

      $scope.remove = function(contactId, controlName) {
        SweetAlert.swal({
          title: '确定删除该客户?',
          text: '删除后将不可恢复',
          type: 'warning',
          confirmButtonColor: '#DD6B55',
          showCancelButton: true
        }, function(isConfirm) {
          if(isConfirm){
             ContactService.remove(contactId).then(function(data) {
              if(data.code == 200){
                  $state.go($state.current, {page:$scope.currPage}, {reload: true});
              }else{
                SweetAlert.swal({
                  title: '删除失败',
                  text: data.message,
                  type: 'warning',
                  confirmButtonColor: '#DD6B55',
                  showCancelButton: false
                });
              }
            });
          }

        });
      }

      $scope.create = function() {
        openContactModal('', 'create');
      }

      $scope.pageChanged = function() {
        $state.go($state.current, {page:$scope.currPage}, {reload: true});
      }

      $scope.changeSearchType = function(type){
        if (type === 'name') {
          $scope.search.type.value = 'name';
          $scope.search.type.text = '姓名';
        } else if(type === 'certificate') {
          $scope.search.type.value = 'certificate';
          $scope.search.type.text = '身份证';
        }
      }

      $scope.startSearch = function(){
        var parent = '';
        if($state.includes('manage')){
          parent = 'manage';
        }else if($state.includes('borrow')){
          parent = 'borrow';
        }

        if($scope.search.keyword == '') {
          $state.go(
          parent+".contact",
          {page:1},
          {reload: true});
        }else{
          $state.go(
          parent+".searchContact",
          {keyword:$scope.search.keyword,type:$scope.search.type.value},
          {reload: true});
        }
      }

      var openContactModal = function(contactId, controlName) {
        var contactModal = $modal.open({
          templateUrl: '/angular/manage/contact/contactModal.html',
          controller: 'ContactModalCtrl',
          size: 'md',
          resolve: {
            contact: function() {
              if (contactId) {
                return  ContactService.get(contactId);

              } else {
                return ContactService.getModel();
              }
            },
            control: function() {
              var control = {
                view: false,
                edit: false,
                create: false
              }

              control[controlName] = true;
              return control;
            }
          }
        });

        contactModal.result.then(function(edited) {
          if (!contactId) {
            ContactService.create(edited).then(function(res) {
              $state.go($state.current, {page:$scope.currPage}, {reload: true});
            });
          } else {
            ContactService.update(edited).then(function(res) {
              $state.go($state.current, {page:$scope.currPage}, {reload: true});
            });
          }
        }, function() {

        })
      }
    }
  ])
})
