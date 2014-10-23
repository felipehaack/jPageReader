/** 
 * @fileOverview API phelipehs criada para facilitar desenvolvimento html5, com as principais chamadas de funções. 
 * @author Felipe Haack Schmitz
 * @version 1.5.2
 */
var phelipehs = {
    /**
     * @argument {maxWidth} int Contém a largura máxima de toda a tela;
     */
    maxWidth: 0,
    /**
     * @argument {maxHeight} int Contém a altura máxima de toda a tela;
     */
    maxHeight: 0,
    /**
     * @argument {hasWebKit} string Se o browser utiliza webkit no CSS. Vai conter nela "-webkit-", é util quando o javascript criar/modificar um container, por exemplo: $(div).css(phelipehs.hasWebKit + 'transform': 'translate3d(10px, 10px, 0px)');
     */
    hasWebKit: "",
    /**
     * @argument {idAnalytics} string Array de IDs do Google Analytics;
     */
    idAnalytics: new Array('UA-44823385-1'),
    /**
     * @argument {siteAnalytics} string variavel opcional para Google Analytics;
     */
    siteAnalytics: "",
    /**
     * @argument {linkToSiteTemporario} string variável temporário utilizada pela API
     */
    linkToSiteTemporario: '',
    /**
     * TouchOrClick é uma variavel que contém filhos que auxiliam na distinção de Touch (mobile) ou Mouse (desktop)
     * Com isto é possível criar funções especificas para, por exemplo, o Click do Mouse ou o Touch do Dedo
     * @argument {start} string Inicia com mousedown (botão do mouse esquerdo pressionado), se for mobile é alterado para touchstart (pressionou o dedo na tela)
     * @argument {move} string Inicia com mousemove (deslocou o mouse sobre a tela), se for mobile é alterado para touchmove (deslocou o dedo pressionando-o sobre a tela)
     * @argument {end} string Inicia com mouseup (dedo do mouse liberado), se for mobile é alterado para touchend (dedo liberado da tela)
     */
    touchOrClick: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    },
    /**
     * Função utilizada pela API
     */
    init: function() {

        phelipehs.setTouchOrClick();
        phelipehs.setHasWebKit();
    },
    /**
     * Ajusta o CONTAINER MAIN com a resolução do dispositivo
     * Com isto pode-se trabalhar com layout em pixels (px)
     * @argument {t} int largura da div main. Ex: 768
     * @argument {n} int altura da div main. Ex: 1024
     * @argument {r} string Div Main. Ex: #container / .container.
     * @argument {i} callback nome da função que será chamado ao termino da função
     */
    gaTrack: function(g, h, i) {
        var c = function(e, j) {
            return e + Math.floor(Math.random() * (j - e))
        };

        var f = 1000000000;
        var k = c(f, 9999999999);
        var a = c(10000000, 99999999);
        var l = c(f, 2147483647);
        var b = new Date().getTime();
        var d = window.location;
        var m = new Image();
        var n = 'http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn=' + k + '&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn=' + h + '&utmr=' + d + '&utmp=' + i + '&utmac=' + g + '&utmcc=__utma%3D' + a + '.' + l + '.' + b + '.' + b + '.' + b + '.2%3B%2B__utmb%3D' + a + '%3B%2B__utmc%3D' + a + '%3B%2B__utmz%3D' + a + '.' + b + '.2.2.utmccn%3D(referral)%7Cutmcsr%3D' + d.pathname + '%7Cutmcct%3D' + d.pathname + '%7Cutmcmd%3Dreferral%3B%2B__utmv%3D' + a + '.-%3B';
        m.src = n
    },
    /**
     * Função utilizada para contar algo generico no servidor do Google Analytics que for necessário
     * Como, os exemplos finais gerados: portrait-to-site, portrait-botao, landscape-to-site, landscape-botao, etc...
     * PS: não esqueça de adicionar o ID da campanha do GA na variavel idAnalytics diferetamente no código ou phelipe.idAnalytics.push('IDAQUI') (se usar o método push cuidado para não duplicar o id)
     * @argument {t} string descrição da informação que será mostrada no GA
     */
    googleAnalyticsGenerico: function(t) {
        if (phelipehs.idAnalytics.length > 0) {
            if (phelipehs.maxHeight > phelipehs.maxWidth) {
                for (var i = 0; i < phelipehs.idAnalytics.length; ++i)
                    phelipehs.gaTrack(phelipehs.idAnalytics[i], phelipehs.siteAnalytics, "portrait-" + t);
            } else {
                for (var i = 0; i < phelipehs.idAnalytics.length; ++i)
                    phelipehs.gaTrack(phelipehs.idAnalytics, phelipehs.siteAnalytics, "landscape-" + t)
            }
        }
    },
    setTouchOrClick: function() {
        var t = "ontouchstart" in document.documentElement;
        if (t) {
            phelipehs.touchOrClick.start = "touchstart";
            phelipehs.touchOrClick.move = "touchmove";
            phelipehs.touchOrClick.end = "touchend"
        }
    },
    setHasWebKit: function() {
        var t = "webkitRequestAnimationFrame" in window;
        if (t) {
            phelipehs.hasWebKit = "-webkit-"
        }
    }
};

phelipehs.init();