;+function(win){

    var el = ['hibox', 'hibox-title', 'hibox-main', 'hibox-dialog', 'hibox-iframe', 'hibox-content', 'hibox-btn', 'hibox-btn', 'hibox-close'];

    var box = {
        alert: function(content, options, yes){
        	var type = typeof options === 'function';
        	if(type) yes = options;
        	return box.show($.extend({
        		content: content,
        		yes: yes
        	}), type ? {} : options);
        },
        confirm: function(content, options, yes, cancel){
        	var type = typeof options === 'function';
        	if(type){
        		cancel = yes;
        		yes = options;
        	};
        	return box.show($.extend({
        		content: content,
        		btn: ready.btn,
        		yes: yes,
        		btn2: cancel
        	}), type ? {});
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
                var self = $(this);
                var is = type ? (type === self.attr('type')) : 1;
                is && box.close(box.attr('times'));
                is = null;
            });
        }
    };

    var ready = {
        config: {},
        btn: ['sure', 'cancel'],
        type: ['dialog', 'page', 'iframe', 'loading', 'tips']
    };

    var Box = function(opt){
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
            case 0:
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
    };
    Box.pt.auto = function(index){
    	var that = this, config = that.config, boxObj = $('#' + el[0] + index);
    	if(config.area[0] == '' && config.maxWidth > 0){
    		if(/MSIE 7/.test(navigator.userAgent) && config.btn){
    			boxObj.width(boxObj.innerWidth());
    			boxObj.outerWidth() > config.maxWidth && boxObj.width(config.maxWidth);
    		}
    	}
    	var area = [boxObj.innerWidth(), boxObj.innerHeight()];
    	var titleHeight = boxObj.find(el[0]).outerHeight() || 0;
    	var btnHeight = boxObj.find('.' + el[6]);
    	function setHeight(el){
    		el = boxObj.find(el);
    		el.height(area[1] - titleHeight - btnHeight);
    	}
    	switch(config.type){
    		case 2:
    		setHeight('iframe');
    		break;
    		default:
    		if(config.area[1] === ''){
    			if(config.fix && area[1] > win.height()){
    				area[1] = win.height();
    				setHeight('.' + el[5]);
    			}
    		}else{
    			setHeight('.' + el[5]);
    		}
    		break;
    	}
    	return that;
    };
    Box.pt.offset = function(index){
    	var that = this, config = that.config, boxObj = that.boxObj;
    	var area = [boxObj.outerWidth(), boxObj.outerHeight()];
    	var type = typeof config.offset == "object";
    	that.offsetTop = (win.height() - area[1])/2;
    	that.offsetLeft = (win.width() - area[0])/2
    	if(type){
    		that.offsetTop = config.offset[0];
    		that.offsetLeft = config.offset[1] || that.offsetLeft;
    	}
    	if(!config.fix){
    		that.offsetTop = /%$/.test(that.offsetTop) ? win.height()*parseFloat(that.offsetTop)/100 : parseFloat(that.offsetTop);
    		that.offsetLeft = /%$/.test(that.offsetLeft) ? win.width()*parseFloat(that.offsetLeft)/100 : parseFloat(that.offsetLeft);
    		that.offsetTop += win.scrollTop();
    		that.offsetLeft += win.scrollLeft();
    	}
    	boxObj.css({top: that.offsetTop, left: offsetLeft});
    };
    Box.pt.callback = function(){
    	var that = this, config = that.config, boxObj = that.object;
    	that.openBox();
    	if(config.success){
    		config.success(boxObj, index);
    	}
    	boxObj.ie6 && that.IE6(boxObj);
    	boxObj.find('.'+el[6]).children('a').on('click', function(){
    		var index = $(this).index();
    		if(index == 0){
    			if(config.yes){
    				config.yes(that.index, boxObj);
    			} else if(config['btn1']){
    				config.btn1(that.index, boxObj);
    			} else {
    				box.close(that.index);
    			}
    		}else{
    			var close = config['btn'+(index + 1)] && config['btn'+(index+1)](that.index, boxObj);
    			close === false && box.close(that.index);
    		}
    	});

    	function cancel(){
    		var close = config.cancel && config.cancel(that.index, boxObj);
    		close === false && boxObj.close(that.index); 
    	}

    	boxObj.find('.' + el[7]).on('click', cancel);

    	if(config.shadeClose){
    		$('#box-shade' + that.index).on('click', function(){
    			boxObj.close(that.index);
    		});
    	}

    	config.end && (ready.end[that.index] = config.end);
    };

    Box.pt.IE6 = function(boxObj){
    	var that = this, _isTop = boxObj.offset().top();
    	function ie6Fix(){
    		boxObj.css({top: _isTop + (that.config.fix ? win.scrollTop() : 0)});
    	}
    	ie6Fix();
    	win.scroll(ie6Fix);

    };

    Box.pt.showBox = function(){
    	var that = this;
    	box.zindex = that.config.zIndex;
    	box.setTop = function(boxObj){
    		var setZindex = function(){
    			box.zIndex++;
    			boxObj.css({'z-index': that.zIndex + 1});
    		};
    		box.zIndex = parseInt(boxObj[0].style.zIndex);
    		boxObj.on('mousedown', setZindex);
    		return boxObj.zIndex;
    	}
    };

    ready.record = function(boxObj){
    	var area = [
    		boxObj.width(),
    		boxObj.height(),
    		boxObj.position().top,
    		boxObj.position().left + parseFloat(boxObj.css('margin-left'));
    	];
    	boxObj.find('.box-max').addClass('box-maxmin');
    	boxObj.attr({area: area});
    };

    win.box = box;

    box.style = function(index, opt){
    	var boxObj = $('#'+el[0]+index), type = boxObj.attr('type');
    	var titleHeight = boxObj.find(el[1]).outerHeight() || 0;
    	var btnHeight = boxObj.find('.' + el[6]).outerHeight || 0;
    	if(type === ready.type[1] || type === ready.type[2]){
    		boxObj.css(options);
    	}
    };

    box.title = function(name, index){
    	var title = $('#'+el[0]+(index || box.index)).find(el[1]);
    	title.html(name);
    };


    ready.run = function(){
        box.open = function(opt){
            var o = new Box(opt);
            return o.index;
        }
    }

}(window);
