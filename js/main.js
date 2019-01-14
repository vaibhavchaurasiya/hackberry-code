//Form
$("#mform").validate({
    errorElement: "span"
});

//owl carousel
$(document).ready(function () {

    $('.owl-carousel').owlCarousel({
        dots: true,
        infinite: true,
        slidesToScroll: 3,
        center: true,
        loop: true,
        margin: 10,
      
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })

});

//header section
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 50) {
        $(".nav-down").addClass("active");
    } else {
        //remove the background property so it comes transparent again (defined in your css)
        $(".nav-down").removeClass("active");
    }
});
