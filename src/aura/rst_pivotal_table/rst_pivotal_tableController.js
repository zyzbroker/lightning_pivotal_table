({
    onInit: function(cmp, evt, h){
        h.init(cmp);
    },

    onRowChanged: function(cmp, evt, h) {
        h.rowChanged(cmp);
    },

    onDataChanged: function(cmp, evt, h){
        h.dataChanged(cmp);
    },

    onSelect: function(cmp, evt, h){
        h.select(cmp, evt);
    }
})