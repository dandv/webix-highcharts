//=require highcharts_standalone
//=require highcharts
//=require highcharts-more

webix.protoUI({ name:"highcharts",

    addSeries: function() {
        // add new series
        this.data.each( function(series) { this.chart.addSeries( series, false, false ); }, this );
        this.chart.redraw();
    },

    reset: function() {
        this.data.clearAll();
        // remove previous series
        while(this.chart.series.length > 0) { this.chart.series[0].remove(false); }
    },

    setParams: function(params) {
        if(params && params.x_axis_min && params.x_axis_max )
            this.chart.xAxis[0].setExtremes(params.x_axis_min, params.x_axis_max);
    },

    getOptions: function() {
      return this.chart.options;
    },

    defaults: {
          chart:{ renderTo: null },
          plotOptions: { series: { animation: false } }
    },

    $init:function(config){

        this._autoreset = (config.autoreset === undefined) ? true : config.autoreset;
        config.chart.renderTo = this.$view;

        this.chart = new Highcharts.Chart(config);
        this.$ready.push(this._after_init_call);
    },

    _after_init_call: function() {
        this.data.attachEvent("onStoreUpdated", webix.bind(this.addSeries, this) );
        if(this._autoreset) {
            this.attachEvent("onBeforeLoad", webix.bind(this.reset, this) );
        }
        this.attachEvent('onViewShow', webix.bind(function() { this.chart && this.chart.reflow(); }, this)); // for multiviews
        if(this.config.data) { this.parse(this.config.data);  }
    },

    $setSize: function(x,y) {
        webix.ui.view.prototype.$setSize.call(this, x, y);
        if(this.chart) this.chart.reflow();
    }

}, webix.DataLoader, webix.EventSystem, webix.ui.view);

