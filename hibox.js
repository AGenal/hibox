;+function(win){

    var el = ['hibox', 'hibox-title', 'hibox-main', 'hibox-dialog', 'hibox-iframe', 'hibox-content', 'hibox-btn', 'hibox-btn', 'hibox-close']

    var box = {
        alert: function(){

        },
        msg: function(content, options, end){

        },
        info: function(){

        },
        loading: function(icon, options){

        },
        close: function(index){
            var boxObj = $('#' + el[0] + index);
            if(!boxObj[0]) return;
            var type = boxObj.attr('type');
            //boxObj[0].innerHtml = '';
            boxObj.remove();
        },
        closeAll: function(type){
            $('.' + el[0]).each(function(){
                var self = $(this),
                var is = type ? (type === self.attr('type')) ? 1 : '';
                is && box.close(box.attr('times'));
                is = null;
            });
        }
    },

    ready = {
        config: {},
        btn: ['确定'， '取消'],
        type: ['dialog', 'page', 'iframe', 'loading', 'tips'];
    },

    BOX = funciton(opt){
       var that = this;
       opt = opt || {};
       that.create();
    };

    Box.pt = Box.prototype;
    Box.pt.create = function(){
        var that = this, config = that.config, times = that.index;
        if($('#' + config.id)[0]) return;
        if(typeof config.area === 'string'){
            config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
        }
        switch (config.type) {
            case case 0:
                config.btn = ('btn' in config) ? config.btn : ready['btn'][0];
                box.closeAll('dialog');
                break;

            default:

        }
        that.show(conType, function(html, titleHtml){
            $('body').append(html[0]);
            conType ? (function(){

            })() : $('body').append(html[1]);
            that.boxObj = $('#' + el[0] + times);
        }).auto(times);
    }

    ready.run = function(){
        box.open = function(opt){
            var o = new Box(opt);
            return o.index;
        }
    }

}(window);
