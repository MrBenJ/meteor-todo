Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // Code here runs only on client
  Template.body.helpers({
    
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter the tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      }
      else {
        // Otherwise, just return all the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    },

  });

  Template.body.events({

    "submit .new-task": function(event) {
      // Called when new task is submitted (enter key)

       var text = event.target.text.value;

       if (text === "") {
          // Do Nothing
       }

       else {
        Tasks.insert({
          text: text, // Title of task
          createdAt: new Date(), // Current time
          owner: Meteor.userId(), // userID
          username: Meteor.user().username, // username
        
        });

      }

        // Clear the form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
  },

  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }

  });

  Template.task.events({
    "click .toggle-checked": function() {
      Tasks.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete": function() {
      Tasks.remove(this._id);
    }
  });

  Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


}


