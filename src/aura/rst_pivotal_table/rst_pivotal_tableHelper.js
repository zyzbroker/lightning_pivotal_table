({
    init: function(cmp) {},

    dataChanged: function(cmp) {
        this._transformData(cmp);
    },

    rowChanged: function(cmp) {
        this._render(cmp);
    },

    select: function(cmp, evt) {
        evt.preventDefault();
        var cell, selRow, cursor, 
            clickable = cmp.get('v.valueClickable'),
            target = evt.target;
        if (!clickable || target.tagName === 'TH') return;

        function getId(e){
            if (e.tagName !== 'TD') return getId(e.parentNode);
            return {
                id: e.id,
                value: e.getAttribute('data-value') || ''
            };
        }

        cell = getId(target.parentNode);
        cursor = cell.id.replace('r','')
            .split('c')
            .map(function(e){return parseInt(e);});
        
        selRow = this._findDataByCursor(cmp, cursor, cell.value);
        this._dispatch(cmp, selRow);  
    },

    _dispatch: function(cmp, payload) {
        var evt = cmp.getEvent('cellClickEvent');
        evt.setParams({
            context: payload
        });
        evt.fire();
    },

    _findDataByCursor: function(cmp, cursor,v){
        var rows = cmp.get('v.rows'), 
            columns = cmp.get('v.columns'),
            rowField = cmp.get('v.rowField'),
            columnField = cmp.get('v.columnField'),
            valueField = cmp.get('v.valueField'),
            keys = Object.keys(rows),
            result = {};
            result[rowField] = keys[cursor[0]];
            result[columnField] = columns[cursor[1]];
            result[valueField] = v;
        return result;
    },

    _transformData: function(cmp) {
        var columns = this._parseColumns(cmp);
        cmp.set('v.columns', columns);
        cmp.set('v.rows', this._parseRows(cmp, columns));
    },

    _parseColumns: function(cmp) {
        var columns = [],
            field = cmp.get('v.columnField'),
            data = cmp.get('v.data');

        data.forEach(function(d) {
            if (columns.indexOf(d[field]) === -1) {
                if (!!d[field]) {
                    columns.push(d[field]);
                }
            }
        });
        return this._sort(columns);
    },

    _sort: function(arr) {
        var numberMatched = /[A-Za-z]+/g.exec(arr[0]);

        if (numberMatched != null) {
            arr.sort(function(a, b) {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
        } else {
            arr.sort(function(a, b) {
                return a - b;
            });
        }
        return arr;
    },

    _parseRows: function(cmp, columns) {
        var rec, pos, key, rows = {},
            colLen = columns.length,
            rowField = cmp.get('v.rowField'),
            colField = cmp.get('v.columnField'),
            valField = cmp.get('v.valueField'),
            data = cmp.get('v.data');

        data.forEach(function(d) {
            key = d[rowField];
            pos = columns.indexOf(d[colField]);
            if (pos !== -1) {
                rec = !!rows[key] ? rows[key] : new Array(colLen);
                rec[pos] = d[valField];
                rows[key] = rec;
            }
        });
        return rows;
    },

    _render: function(cmp) {
        var valueUiHandler, html = cmp.find('html'), rec,
            rowLabel = cmp.get('v.rowLabel') || cmp.get('v.rowField'),
            columns = cmp.get('v.columns'),
            content = [],
            rowIndex = 0,
            clickable = cmp.get('v.valueClickable'),
            uiType = cmp.get('v.valueUiType'),
            rows = cmp.get('v.rows');

        //get ui handler
        if(uiType === 'checkbox'){
            valueUiHandler = !!clickable ? genClickableCheckbox : genCheckbox;
        } else {
            valueUiHandler = !!clickable ? genClickable : genDefaulValueUI;
        }

        content.push('<table><thead><tr>');
        content.push('<th>');
        content.push(rowLabel);
        content.push('</th>');
        columns.forEach(function(c){
            content.push('<th>');
            content.push(c);
            content.push('</th>');
        });
        content.push('</tr></thead>');

        function genCheckbox(v){
            return !!v 
                ? '<span><i class="fa fa-check" aria-hidden="true"></i></span>'
                : '<span>&nbsp;</span>';
        }

        function genClickable(v){
            return ['<button>', v, '</button>'].join('');
        }

        function genClickableCheckbox(v){
            return !!v 
                ? '<button><i class="fa fa-check" aria-hidden="true"></i></button>'
                : '<button>&nbsp;</button>';
        }

        function genDefaulValueUI(v){
            return ['<span>',v, '</span>'].join('');
        }

        content.push('<tbody>');

        Object.keys(rows).forEach(function(k){
            rec = rows[k];
            content.push('<tr><th>');
            content.push(k);
            content.push('</th>');
            //value
            rec.forEach(function(v, index){
                content.push(['<td id="r', rowIndex, 'c', index, '" data-value="', v, '">'].join(''));
                content.push(valueUiHandler(v));
                content.push('</td>');
            });
            content.push('</tr>');
            rowIndex++;
        });
        content.push('</tbody></table>');
        html.set('v.value', content.join(''));
    }
})