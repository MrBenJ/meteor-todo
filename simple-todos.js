Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // Code here runs only on client
  Meteor.subscribe("tasks");
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
        Meteor.call("addTask", text);

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
      Meteor.call("setChecked", this._id, ! this.checked);
    },

    "click .delete": function() {
      Meteor.call("deleteTask", this._id);
    },

    "click .toggle-private": function() {
      Meteor.call("setPrivate", this._id, ! this.private);
    },


  });

  Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"

});

  Template.task.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    },

  });


}

Meteor.methods({
  addTask: function(text) {
    // Make sure user is logged in before task creation is ready

    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if(Meteor.user().username === undefined) {
      var username = Meteor.user().profile.name;
    }
    else {
      var username = Meteor.user().username;
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: username,

    });
  },

  deleteTask: function(taskId) {
    Tasks.remove(taskId);
  },

  setChecked: function(taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: {private: setToPrivate} });

  },


});




if (Meteor.isServer) {
  Meteor.publish("tasks", function() {
    return Tasks.find({
      $or: [
        { private: {$ne: true}},
        { owner: this.userId }
      ]
    });
  });
}


