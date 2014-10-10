// Set jQuery variable
var j = {
	Q: jQuery,
} // End j

// Document ready functions
jQuery(document).ready(function() {
	sS.setSlideWidth();
	sS.setSlideTabs();
	sS.setActions();
	sS.autoMove();
	sS.moveEnd();
	sS.handleInfo();
});

// SlideShow functions
var sS = {
	// Declare variables
	ssw: 100,
	swt: '%',
	ssww: 0,
	
	sw: 0, // slide width holder - will be set
	cnt: 0, // used to hold count
	rsz: {}, // window resize timeout
	tm: 1000, // animation time length
	amv: 7000, // auto move pause length
	interval: {}, // auto move set interval
	clk: 0, // if slide square is clicked

	setSlideWidth: function() {
		if (sS.swt == '%' && sS.ssw >= 100) {
			sS.ssw = 100;
			sS.ssww = sS.ssw+''+sS.swt;
		} else {
			sS.ssww = sS.ssw+''+sS.swt;
		}
		var simg = j.Q('.slide-img');

		// set slide hold div width as a percentage equal to the total amount of slides
		var num = simg.length * 110;
		var numper = num+'%';
		j.Q('#slide-contain').css('width', sS.ssww);
		j.Q('#slide-hold').css('width', numper);
		sS.sw = parseInt(j.Q('#slide-show').width());
		simg.css('width', sS.sw+'px');
		// set the right position of each slide info div
		sS.cnt = 0;
		j.Q('.slide-info').each(function() {
			var infor = parseInt(j.Q(this).css('right'), 10);
			if (sS.cnt != 0) {
				infor = infor + (sS.sw * sS.cnt);
				j.Q(this).css('right', infor);
			}
			sS.cnt++;
		});
		sS.cnt = 0;
		j.Q('#slide-links').css("left", Math.max(0, ((sS.sw - j.Q('#slide-links').outerWidth()) / 2) + j.Q(window).scrollLeft()) + 'px');
	},
	setSlideTabs: function() {
		sS.cnt = 0;
		j.Q('#slide-info').append('<div id="slide-links-'+sS.cnt+'" class="slide-links"></div><!-- #slide-links-'+sS.cnt+' -->');
		j.Q('.slide-info').each(function() {
			j.Q(this).append('<div id="slide-links-'+sS.cnt+'" class="slide-links"></div><!-- #slide-links-'+sS.cnt+' -->');
			sS.cnt++;
		});
		sS.cnt = 0;
		j.Q('.slide-img').each(function() {
			j.Q('.slide-links').append('<div class="slide-link-'+sS.cnt+' slide-link"></div><!-- .slide-link-'+sS.cnt+' -->');
			if (('slide-img-'+sS.cnt) == j.Q('#slide-hold').children(0).attr('id')) {
				j.Q('.slide-link-'+sS.cnt).addClass('focus-link');
			} else {
			}
			sS.cnt++;
		});
		sS.cnt = 0;
	},

	handleInfo: function() {
		var snfo = j.Q('.slide-info');
		var infoMT = '-22%';
		snfo.animate({ opacity: 0 }, 0).css('display', 'block');
		snfo.animate({
			opacity: 1,
			marginTop: infoMT,
		}, sS.tm, function() {
		});
	},
	autoMove: function() {
		if (j.Q('.slide-img').length > 1) {
			sS.interval = setInterval(function() {
				sS.moveS('r');
			}, sS.amv);
			j.Q('.show-dir').fadeOut( "slow", function() {
			});
		}
	},
	moveEnd: function() {
		sS.cnt = 0;
		j.Q('.slide-link').each(function() {
			if (('slide-img-'+sS.cnt) == j.Q('#slide-hold').children(0).attr("id")) {
				j.Q('.slide-link-'+sS.cnt).addClass('focus-link');
				j.Q('.slide-link-'+sS.cnt).removeClass('no-focus');
			} else {
				j.Q('.slide-link-'+sS.cnt).addClass('no-focus');
				j.Q('.slide-link-'+sS.cnt).removeClass('focus-link');
			}
			sS.cnt++
		});
		// if a slider button was clicked
		if (sS.clk == 1) {
			var simg = j.Q('.slide-img');
			var simgl = simg.length;
			var imgnum = j.Q('#slide-hold div').first().attr('id').match(/\d+$/)[0];
			var imgend = imgnum;
			var imgnump = imgnum;
			// adjust all of the slides in order
			simg.each(function() {
				imgnump++;
				if (imgnump == simgl) { imgnump = 0; }
				if (imgnump != imgend) {
					j.Q('#slide-img-'+imgnum).after(j.Q('#slide-img-'+imgnump));
					imgnum++;
					if (imgnum == simgl) { imgnum = 0; }
				}
			});
			sS.clk = 0;
		}
		sS.cnt = 0;
	},
	moveS: function(d) {
		var sldh = j.Q('#slide-hold');
		var simgl = j.Q('.slide-img').length;
		var snfo = j.Q('.slide-info');
		var hold = parseInt(j.Q('#slide-hold').css('right'), 10);
		var holdt = 0;
		var tot = (sS.sw * simgl) - sS.sw;
		if (hold < tot) {
			if (d == 'l') {
				holdt = 0;
				sldh.css('right', sS.sw).prepend(sldh.children().last());
			} else if (d == 'r') {
				holdt = sS.sw;
			}
		} else {
			if (d == 'l') {
				holdt = 0;
			} else if (d == 'r') {
				holdt = sS.sw;
				sldh.css('right', 0).prepend(sldh.children().last());
			}
		}
		
		sldh.animate({
			right: holdt,
		}, sS.tm, function() {
			if (d == 'l') {
				sS.moveEnd();
				sldh.prepend(sldh.last()).css('right', 0);
			} else if (d == 'r') {
				sldh.append(sldh.children().eq(0)).css('right', 0);
				sS.moveEnd();
			}
		});
		
		sS.cnt = 0;

		snfo.hide().css('marginTop', '-30%');
		var infor = parseInt(snfo.css('right'), 10);
		snfo.animate({
			right: infor - holdt,
		}, sS.tm).promise().then(function(){ sS.handleInfo(); });
	},
	stopMove: function() {
		clearInterval(sS.interval);
		j.Q('.show-dir').fadeIn( 'slow', function() {
		});
	},
	setActions: function() {
		var simg = j.Q('.slide-img');
		var simgl = simg.length;
		if (simgl > 1) {
			j.Q('#show-r').click(function() {
				sS.moveS('r');
			});
			j.Q('#show-l').click(function() {
				sS.moveS('l');
			});
			j.Q('#slide-show').mouseenter(sS.stopMove).mouseleave(sS.autoMove);
		}

		j.Q('.slide-link').click(function() {
			// get the slide place number from the slide-sqr class
			var clsnum = j.Q(this).attr('class').match(/slide-link-\d+/).toString();
			var clsnum = clsnum.match(/\d+$/)[0];

			// find the slide that has the matching place number
			simg.each(function() {
				var imgnum = j.Q(this).attr('id').match(/\d+$/)[0];
				// if the slide place numbers match and it is not the current slide page view
				if (clsnum == imgnum && j.Q('#slide-hold').children(0).attr('id') != ('slide-img-'+imgnum)) {
					j.Q('#slide-hold div').first().after(j.Q(this));
					sS.moveS('r');
					sS.clk = 1;
				}
			});
			sS.cnt = 0;
		});
		j.Q(window).resize(function() {
			clearTimeout(sS.rsz);
			sS.rsz = setTimeout(sS.setSlideWidth(), 100);
		});
	},
} // End sS