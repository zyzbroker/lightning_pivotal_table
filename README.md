# Salesforce Lightning Component - Pivotal Table

This pivotal table enable the application developers to present the hierachical data the pivotal way.
It will have chart capability to make data more visualizable and readable.

## How to install Pivotal Table Component And Demo
[Unmanaged package](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t6A000000JTUL)

## How to use the Pivotal Table Component

### Step1: add the below html into your container component
note that you can pass in data from the container component attribue as shown here.

```HTML
 <c:rst_pivotal_table aura:id="pivotalTable"
            data="{!v.data}"
            title="Opportunity Security Settings"
            columnField="stage"
            rowField="action"
            rowLabel="Action"
            valueField="value"
            valueUiType = 'checkbox'
            valueClickable = 'false'
            />
```

#### attribute definitions


### Step2: in your container component, you need to handle the cell click event

```HTML
    <aura:handler name="cellClickEvent" event="c:rst_click_event" action="{! c.onCellClick}" />
```

```Javascript
    onCellClick: function(cmp, evt, h){
        var context = evt.getParam('context');
        console.log('----subscribe event---');
        console.log(context);
    }
```

##Todo
We will implement chart.js integration with this component in the next release.


## The Pivotal Demo Application Screenshot

![GitHub Logo](/images/PivotalTable.png)