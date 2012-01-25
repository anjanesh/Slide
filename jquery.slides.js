(function($)
{
    $.fn.jscoin_slide = function(options)
    {
        var defaults =
        {
            effect : 'fade' // fade, flip, slide, slideUp
        };

        var $this;
        var opts = $.extend(defaults, options);
        var currentSlideIndex = 0, lastSlideIndex;
        var curSlide, nextSlide;
        var counter;
        var width, height;
        var timer1 = null;

        var navigate = function(n)
        {
            if (timer1 != null) return; // Slide in action
            
            // Move Left while current slide is at beginning
            if (n == -1 && currentSlideIndex == 0)
             return;
            
            // Move Right while current slide is at last
            if (n == 1 && currentSlideIndex == lastSlideIndex - 1)
             return;

            curSlide  = $this.children('img:eq(' + currentSlideIndex + ')');
            nextSlide = $this.children('img:eq(' + (currentSlideIndex + n) +')');

            switch (opts.effect)
            {
                case "fade":
                 curSlide.fadeOut();
                 nextSlide.fadeIn();
                break;
                case "flip":
                 curSlide.slideUp();
                 nextSlide.slideDown();
                break;
                case "slide":
                 nextSlide.css('left', n * width + 'px').show();
                 timer1 = setInterval(function(){ move(n) }, 1);
                break;
                case "slideUp":
                 nextSlide.css('top', n * height + 'px').show();
                 timer1 = setInterval(function(){ move(n) }, 1);
                break;
            }

            currentSlideIndex = currentSlideIndex + n;
            updateCounter();
        };

        var move = function(n)
        {
            var cs = curSlide.position();
            var ns = nextSlide.position();
            var cp_new, np_new;

            switch(opts.effect)
            {
                case "slide":
                    if (cs.left == -width * n) { clearInterval(timer1); timer1 = null; }
                    switch(n)
                    {
                        case 1:
                         cp_new = Math.max(cs.left - 50 * n, -width);
                         np_new = Math.max(ns.left - 50 * n, 2);
                        break;
                        case -1:
                         cp_new = Math.min(cs.left - 50 * n, width);
                         np_new = Math.min(ns.left - 50 * n, 2);
                        break;
                    }
                    curSlide.css('left', cp_new + 'px');
                    nextSlide.css('left', np_new + 'px');
                break;
                case "slideUp":
                    if (cs.top == -height * n) { clearInterval(timer1); timer1 = null; }
                    switch(n)
                    {
                        case 1:
                         cp_new = Math.max(cs.top - 20 * n, -height);
                         np_new = Math.max(ns.top - 20 * n, 2);
                        break;
                        case -1:
                         cp_new = Math.min(cs.top - 20 * n, height);
                         np_new = Math.min(ns.top - 20 * n, 2);
                        break;
                    }
                    curSlide.css('top', cp_new + 'px');
                    nextSlide.css('top', np_new + 'px');
                break;
            }
        };

        var updateCounter = function()
        {
            var html = "";
            var zeros = lastSlideIndex.toString().length - (currentSlideIndex + 1).toString().length;
            html += Array(zeros + 1).join("0") + (currentSlideIndex + 1) + " / " + lastSlideIndex;
            $(counter).html(html);
        };

        return this.each(function()
        {
            $this = $(this);
            lastSlideIndex = $this.children('img').size();

            // If not hidden in CSS already, but hiding not really necessary
            $this.children("img:gt(0)").hide(); // Hide all images except the first one
            
            width = $this.width();
            height = $this.height();

            // Add navigation bar to bottom
            $this.css('height',(height + 30) + 'px');

            // Navigation Container
            var div = document.createElement('div');
            div.className = "nav";
            div.style.marginTop = height + "px";
            $this.append(div);

            // Previous
            var prev = document.createElement('button');
            prev.className = "prev";
            $(prev).html("&#9668;");

            // Play / Pause
            var play = document.createElement('button');
            play.className = "play";
            $(play).html("&#8269;");

            // Next
            var next = document.createElement('button');
            $(next).html("&#9658;");
            next.className = "next";

            // First
            var first = document.createElement('button');
            first.className = "first";
            $(first).html("&#8739;&#9668;");

            // Last
            var last = document.createElement('button');
            $(last).html("&#9658;&#8739;")
            last.className = "last";

            // Counter
            counter = document.createElement('span');
            //$(counter).html("1 / " + lastSlideIndex);
            counter.className = "counter";
            updateCounter();

            $(div).append(first).append(prev).append(next).append(last).append(counter); // append(play)

            $(prev).bind("click", function(){ navigate(-1); });
            $(next).bind("click", function(){ navigate(1); });

            $(first).bind("click", function()
            {
                if (currentSlideIndex == 0) return;
                curSlide  = $this.children('img:eq(' + currentSlideIndex + ')');
                nextSlide = $this.children('img:first');
                curSlide.hide();
                nextSlide.css('left','2px').css('top','2px').show();
                currentSlideIndex = 0;
                updateCounter();
            });
            $(last).bind("click", function()
            {
                if (currentSlideIndex == lastSlideIndex - 1) return;
                curSlide  = $this.children('img:eq(' + currentSlideIndex + ')');
                nextSlide = $this.children('img:last');
                curSlide.hide();
                nextSlide.css('left','2px').css('top','2px').show();
                currentSlideIndex = lastSlideIndex - 1;
                updateCounter();
            });
        });
    }
})(jQuery);
