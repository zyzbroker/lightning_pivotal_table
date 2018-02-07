({
    STAGES: ['Queued','Work In Progress','QA','Deployed'],
    ACTIONS: ['Create','Read','Update','Delete'],

    init: function(cmp){        
        this._setData(cmp);
    },

    cellClicked: function(cmp, evt){
        var context = evt.getParam('context');
        console.log('----subscribe event---');
        console.log(context);
    },

    _setData: function(cmp){
        var data = [],
            self = this;

        function getValue(){
            return  Math.round(Math.random() * 100) % 2;
        }
        
       this.ACTIONS.forEach(function(act){
            self.STAGES.forEach(function(stage){
                data.push({
                    'action': act,
                    'stage': stage,
                    'value': getValue()
                });
            });
        });
       console.log(data);
       cmp.set('v.data', data);
    },
})