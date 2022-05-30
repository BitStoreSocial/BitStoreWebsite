$(() => {
    $(document).ready(() => {
        let environmentStr = '.pc_temp';
        let isFirstLoad = true;
        let vm = null;
        let isMobile = false;

        if ((navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            ))) {
            isMobile = true;
        } else {
            isMobile = false;
        }
        const CriticalWidth = 10;

        const ResizeDebounce = (fn, wait) => {
            let timeout = null;
            return () => {
                if (timeout !== null) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(fn, wait);
            }
        }
        const ResizeHandle = () => {
            // 引入 header 和 footer
            let htmlWidth = $("html").width();
            // htmlWidth = $(window).width();
            // let scaleVal = htmlWidth / 1920;
            // if (scaleVal >= 1) {
            //     scaleVal = 1;
            // }
            // $("html").css({
            //     transform: `scale(${scaleVal})`,
            //     transformOrigin: "0 0"
            // })
            if (isFirstLoad) {
                // isFirstLoad = false;
            } else if (((htmlWidth >= CriticalWidth || isMobile == false) && environmentStr == '.pc_temp') || ((htmlWidth < CriticalWidth || isMobile == true) && environmentStr == '.mobile_temp')) {
                return;
            }
            if (htmlWidth >= CriticalWidth && isMobile == false) {
                // pc
                environmentStr = '.pc_temp';
            } else {
                // mobile
                environmentStr = '.mobile_temp';
            }

            function initHeaderDom() {
                return new Promise((resolve) => {
                    $("header.page-header,footer.page-footer").remove();
                    $('<header>', { "class": "page-header" }).prependTo($('body #app')).load("./components/header.html", () => {
                        $(".page-header-inner").html($(`.page-header ${environmentStr}`).html());
                        $(".page-header template").remove();
                        resolve();
                    });
                })
            }

            function initFooterDom() {
                return new Promise((resolve) => {
                    $('<footer>', { "class": "page-footer" }).appendTo($('body #app')).load("./components/footer.html", () => {
                        $(".page-footer-inner").html($(`.page-footer ${environmentStr}`).html());
                        $(".page-footer template").remove();
                        resolve();
                    });
                })
            }

            Promise.all([
                initHeaderDom(),
                initFooterDom()
            ]).then(() => {
                try {
                    i18next
                        .use(i18nextHttpBackend)
                        .use(i18nextBrowserLanguageDetector)
                        .init({
                            backend: {
                                loadPath: "./locales/{{lng}}/{{ns}}.json",
                            },
                            debug: true,
                            fallbackLng: 'en',
                            lng: localStorage.getItem('i18nextLng') || 'en',
                        }, (err, t) => {
                            if (err) return console.error(err);
                            jqueryI18next.init(i18next, $, { useOptionsAttr: true });
                            if (isFirstLoad) {
                                isFirstLoad = false;
                                vm = new Vue({
                                    el: "#app",
                                    data() {
                                        return {
                                            isPc: environmentStr == '.pc_temp',
                                            downloadType: 1, //download
                                            lang: 'EN',
                                            carouselIndex: 0,
                                            autoplay: true,
                                            showMoreLang: false
                                        }
                                    },
                                    created() {
                                        let type = i18next.language;
                                        if (type == 'en') {
                                            this.lang = 'EN'
                                        } else if (type == 'id') {
                                            this.lang = 'ID'
                                        } else if (type == 'zh') {
                                            this.lang = 'ZH'
                                        } else if (type == 'vi') {
                                            this.lang = 'VI'
                                        } else if (type == 'fr') {
                                            this.lang = 'FR'
                                        } else if (type == 'ko') {
                                            this.lang = 'KO'
                                        } else if (type == 'ja') {
                                            this.lang = 'JA'
                                        }
                                    },
                                    mounted() {
                                        $('body').localize();
                                        window.scrollReveal = new scrollReveal({
                                            enter: 'top',
                                            move: '30px',
                                            over: '0.5s',
                                            reset: false, //true  false
                                            opacity: 0,
                                        });
                                        if (i18next.language != 'en' && i18next.language != 'id' && i18next.language != 'zh' && i18next.language != 'vi' && i18next.language != 'fr' && i18next.language != 'ko' && i18next.language != 'ja') {
                                            this.changeLang('en');
                                        } else {
                                            let i18nextLng = localStorage.getItem('i18nextLng') || i18next.language;
                                            console.log(i18nextLng);
                                            this.changeLang(i18nextLng);
                                        }

                                        try {
                                            var clipboard = new ClipboardJS('#copy_btn');
                                        } catch (e) {}
                                    },
                                    methods: {
                                        switchDownLoadType(type) {
                                            this.downloadType = type;
                                        },
                                        changeLang(type) {
                                            // 修改语言:
                                            i18next.changeLanguage(type).then(() => {
                                                $('body').localize();
                                                if (type == 'en') {
                                                    this.lang = 'EN'
                                                } else if (type == 'id') {
                                                    this.lang = 'ID'
                                                } else if (type == 'zh') {
                                                    this.lang = 'ZH'
                                                } else if (type == 'vi') {
                                                    this.lang = 'VI'
                                                } else if (type == 'fr') {
                                                    this.lang = 'FR'
                                                } else if (type == 'ko') {
                                                    this.lang = 'KO'
                                                } else if (type == 'ja') {
                                                    this.lang = 'JA'
                                                }

                                                this.showMoreLang = false;
                                            })

                                        },
                                        onCarouseLeave() {
                                            this.autoplay = true;
                                        },
                                        changeCarousel(ind) {
                                            this.carouselIndex = ind;
                                            this.$refs.el_carousel.setActiveItem(ind);
                                            this.autoplay = false;
                                        },
                                        onCarouselChange(ind) {
                                            this.carouselIndex = ind;
                                        },
                                        keepBrowsing() {
                                            window.location.href = "./bitstore/index.html"
                                        }

                                    }
                                });
                            } else {
                                vm.$data.isPc = environmentStr == '.pc_temp';
                                $('body').localize();
                            }
                        });
                } catch (e) {
                    alert('asdf')
                    console.log(e);
                }

            })
        }
        $(window).on('resize', ResizeDebounce(ResizeHandle, 100));
        ResizeHandle();
    });


    //watch height and Dynamic digital
    var triggerTimes = 0;
    window.onscroll = function() {
        try {
            if ($(".index-section3").length == 0) {
                return;
            }
            var scrollTop = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var offsetTop = $(".section3.index-section3").get(0).offsetTop - document.documentElement.scrollTop;
            if (offsetTop + 300 <= scrollTop) {
                triggerTimes++;
                triggerTimes === 1 ? dynamicDigital() : '';
            }
        } catch (e) {
            console.log(e);
        }

    }

    function dynamicDigital() {
        var a = 0;
        var b = setInterval(displaya, 10);
        var c = 0;
        var d = setInterval(displayc, 10);
        var e = 0;
        var f = setInterval(displaye, 10);


        function displaya() {
            if (a < 150000) {
                a += 500;
                $("#dau").html(Math.ceil(a));
            } else {
                $("#dau").html(150000);
                clearInterval(b);
            }
        }

        function displayc() {
            if (c < 1700) {
                c += 5.666;
                $("#ave").html(Math.ceil(c));
            } else {
                $("#ave").html(1700);
                clearInterval(d);
            }
        }

        function displaye() {
            if (e < 500000) {
                e += 1666.66;
                $("#total").html(Math.ceil(e));
            } else {
                $("#total").html(500000);
                clearInterval(f);
            }
        }
    }
});

window.getBitStoreVersion = version => {
    if (!localStorage.getItem('bitStoreVersion') || localStorage.getItem('bitStoreVersion') !== version) {
        localStorage.setItem('bitStoreVersion', version); // 保存 以便下次使用判断
        let urlObj = new URL(location.href);
        if (urlObj.search) {
            urlObj.search += `&timeStamp=${new Date().getTime()}`;
        } else {
            urlObj.search = `timeStamp=${new Date().getTime()}`;
        }

        function locationReplace(url) {
            if (history.replaceState) {
                history.replaceState(null, document.title, url);
                history.go(0);
            } else {
                location.replace(url);
            }
        }
        locationReplace(urlObj.toString());
    }
};
(function() {
    let versionScript = document.createElement("script");
    versionScript.src = './js/bitStoreVersion.js?v=' + new Date().getTime();
    let s = document.querySelector("script");
    s.parentNode.insertBefore(versionScript, s);
})();

(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {




            let isMobile = false;
            if ((navigator.userAgent.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                ))) {
                isMobile = true;
            } else {
                isMobile = false;
            }

            if (isMobile) {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                // 这里的780 取决于设计稿的宽度
                if (clientWidth >= 780) {
                    docEl.style.fontSize = '78px';
                } else {
                    docEl.style.fontSize = 78 * (clientWidth / 780) + 'px';
                }
            } else {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                // 这里的780 取决于设计稿的宽度
                if (clientWidth >= 1920) {
                    docEl.style.fontSize = '100px';
                } else {
                    docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
                }
            }







        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


function goPAGE() {

}
goPAGE();