define(['app'], function(app) {
  return app.controller('ContactController', ['$scope', 'contacts', 'SweetAlert', '$modal', 'ContactService', '$timeout',
    function($scope, contacts, SweetAlert, $modal, ContactService, $timeout) {

      $scope.contacts = contacts;

      $scope.totalNum = $scope.contacts.length;
      $scope.currPage = 1;
      $scope.numPerPage = 10;
      $scope.currContacts = $scope.contacts.slice(($scope.currPage - 1) * $scope.numPerPage, $scope.currPage * $scope.numPerPage);

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
        }, function() {
          ContactService.remove(contactId).then(function() {
            refreshData();
          });
        });
      }

      $scope.create = function() {
        openContactModal('', 'create');
      }

      $scope.pageChanged = function() {
        $scope.currContacts = $scope.contacts.slice(($scope.currPage - 1) * $scope.numPerPage, $scope.currPage * $scope.numPerPage);
      }

      var openContactModal = function(contactId, controlName) {
        var contactModal = $modal.open({
          templateUrl: '/angular/manage/contact/contactModal.html',
          controller: 'ContactModalCtrl',
          size: 'md',
          resolve: {
            contact: function() {
              if (contactId) {
                return ContactService.get(contactId);
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
          console.log(edited);
          if (controlName == 'create') {
            ContactService.create(edited).then(function() {
              refreshData();
            });
          } else if (controlName == 'edit') {
            ContactService.update(edited).then(function() {
              refreshData();
            });
          }
        }, function() {

        })
      }

      var refreshData = function() {
        ContactService.getAll().then(function(data) {
          $scope.contacts = data;
          $scope.currContacts = $scope.contacts.slice(($scope.currPage - 1) * $scope.numPerPage, $scope.currPage * $scope.numPerPage);
          $timeout(function() {
            $scope.$apply();
          }, 0)
        });
      }
    }
  ])
})
