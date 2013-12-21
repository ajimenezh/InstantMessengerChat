var myScroll;

function loaded () {
  myScroll = new IScroll("#wrapper-account", { mouseWheel: true });
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

$(document).foundation();

$(document).ready(function(){
    $("a").click(function(e){
        e.preventDefault();
        var txt = $(".text").html();
        $(".text").replaceWith("<input value='" + txt + "' />");
        $(this).replaceWith("<a href='#'>Guardar</a> | <a href='#'>Cancelar</a>");
    });
});