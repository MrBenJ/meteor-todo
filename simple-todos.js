
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // Code here runs only on client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({

    "submit .new-task": function(event) {
      // Called when new task is submitted (enter key)

       var text = event.target.text.value;

        Tasks.insert({
          text: text,
          createdAt: new Date() // Current time
        });

        // Clear the form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
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


}
