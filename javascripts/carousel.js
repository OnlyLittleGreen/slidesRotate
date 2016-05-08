;(function($){

	var Carousel = function(poster){
		
		var self = this;
		// The outermost layer for each elements in posters.
		this.poster = poster;
		
		this.posterItemMain = this.poster.find('ul.poster-list');
		this.prevBtn = this.poster.find('div.poster-prev-btn');
		this.nextBtn = this.poster.find('div.poster-next-btn');
		this.posterItems = this.poster.find('li.poster-item');
		if(this.posterItems.size()%2 == 0){
			this.posterItemMain.append(this.posterItems.eq(0).clone());
			this.posterItems = this.posterItemMain.children();
		};
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.rotateFlag = true;
		// Default settings
		this.settings = {
			'width':800,
			'height':270,
			'posterWidth':640,
			'posterHeight':270,
		 	'scale':0.9,
			'autoPlay':false,
			'verticalAlign':'center'};

		$.extend(this.settings,this.getSettings());

		// Set settings to relative setting data
		this.setSettingValues();
		this.setPosterpos();

		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRotate('left');
			}
		});

		this.prevBtn.click(function() {
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouselRotate('right');
			}
		});
		
		if(this.settings.autoPlay){
			this.autoPlay();
			this.poster.hover(function() {
				window.clearInterval(self.timer);
			}, function() {
				self.autoPlay();
			});
		}
	};

	Carousel.prototype = {

		autoPlay : function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.settings.delay);
		},

		// Rotate
		carouselRotate : function(direction){
			
			var _this_ = this;

			if(direction === 'left'){
				this.posterItems.each(function(){
					var self = $(this),
						prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css('zIndex'),
						opacity = prev.css('opacity'),
						left = prev.css('left'),
						top = prev.css('top');

					self.animate({
						width:width,
						height:height,
						zIndex:zIndex,
						opacity:opacity,
						left:left,
						top:top
					},_this_.settings.speed,function(){
						_this_.rotateFlag = true;
					});
				});

				

			} else if (direction === 'right') {

				var _this_ = this;

				this.posterItems.each(function(){
					var self = $(this),
						next = self.next().get(0)?self.next():_this_.posterFirstItem,
						width = next.width(),
						height = next.height(),
						zIndex = next.css('zIndex'),
						opacity = next.css('opacity'),
						left = next.css('left'),
						top = next.css('top');

					self.animate({
						width:width,
						height:height,
						zIndex:zIndex,
						opacity:opacity,
						left:left,
						top:top
					},_this_.settings.speed,function(){
						_this_.rotateFlag = true;
					});

				});

			}
		},

		// Set positions of rest slides
		setPosterpos : function(){

			var _self = this;

			var sliceItems = this.posterItems.slice(1),
				sliceSize = sliceItems.size()/2,
				rightSlice = sliceItems.slice(0, sliceSize),
				level = Math.floor(this.posterItems.size()/2),
				leftSlice = sliceItems.slice(sliceSize);


			// Set right slides
			
			var rw = this.settings.posterWidth,
				rh = this.settings.posterHeight,
				gap = ((this.settings.width - this.settings.posterWidth) / 2) / level;

			var firstSlideLeftArea = (this.settings.width - this.settings.posterWidth) / 2;
			var fixOffsetLeftArea = firstSlideLeftArea + rw;
			
			rightSlice.each(function(index){
				
				level--;
				rw = rw * _self.settings.scale;
				rh = rh * _self.settings.scale;

				var j = index;
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++j),
					left:fixOffsetLeftArea+(++index)*gap-rw,
					top:_self.setVerticalAlign(rh)
				});
			});

			var lw = rightSlice.last().width(),
				lh = rightSlice.last().height(),
				
				opacityLoop = Math.floor(this.posterItems.size()/2);
			
			leftSlice.each(function(index){

				$(this).css({
					zIndex:level,
					width:lw,
					height:lh,
					opacity:1/opacityLoop,
					left:index * gap,
					top:_self.setVerticalAlign(lh)
				});
				lw = lw/_self.settings.scale;
				lh = lh/_self.settings.scale;
				opacityLoop--;
			});

		},

		// Set style of vertical aligning
		setVerticalAlign : function(height){
			var verticalType = this.settings.verticalAlign,
				top = 0;

			if(verticalType === "center"){
				top = (this.settings.height - height) / 2;
			} else if (verticalType === "bottom"){
				top = this.settings.height - height
			} else if (verticalType === "top"){
				top = 0;
			} else {
				top = (this.settings.height - height) / 2;
			}
			return top;
		},

		//  Set settings to control widths and heights of each slide gallery
		setSettingValues : function(){
			this.poster.css({
				width:this.settings.width,
				height:this.settings.height
			});
			this.posterItemMain.css({
				width:this.settings.width,
				height:this.settings.height
			});

			var widthForBtn = (this.settings.width - this.settings.posterWidth) / 2;

			this.prevBtn.css({
				width:widthForBtn,
				height:this.settings.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});

			this.nextBtn.css({
				width:widthForBtn,
				height:this.settings.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});

			this.posterFirstItem.css({
				width:this.settings.posterWidth,
				height:this.settings.posterHeight,
				left:widthForBtn,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
		},

		// Get custom settings
		getSettings : function(){
			var settings = this.poster.attr('data-settings');
			if(settings && settings!=""){
				return $.parseJSON(settings);
			} else {
				return {};
			}			
		}
	};

	Carousel.init = function(posters){
		
		var _this_ = this;

		posters.each(function() {
			new _this_($(this));
		});
	};

	window['Carousel'] = Carousel;


})(jQuery);