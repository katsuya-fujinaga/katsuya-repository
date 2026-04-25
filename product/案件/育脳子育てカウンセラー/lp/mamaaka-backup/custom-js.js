<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

<script>
$(function(){
  $('a[href^="#"]').click(function(){
    var speed = 300;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
	
	
  let $pagetop = $('.flbtn');

  $(window).on( 'scroll', function () {
    //スクロール位置を取得
    if ( $(this).scrollTop() < 1500 ) {
      $pagetop.css('opacity','0');
      $pagetop.css('display','none');
		
    } else {
      $pagetop.css('opacity','1');
      $pagetop.css('display','block');
    }
  });	
	
});
</script>

<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '999530904852345');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=999530904852345&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->