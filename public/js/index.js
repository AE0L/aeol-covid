document.addEventListener('DOMContentLoaded', function() {
    var action_btn = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(action_btn, {
        direction: 'top',
        hoverEnabled: false
    });

    var drop_downs = document.querySelectorAll('.dropdown-trigger')
    M.Dropdown.init(drop_downs, {
        alignment: 'right',
        coverTrigger: false
    })
  });
