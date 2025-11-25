(function () {
  var translations = {
    gl: {
      htmlLang: 'gl',
      pageTitle: 'Lumes en Galicia — StoryMap',
      languageSelectorLabel: 'Escoller idioma',
      topbarTitle: 'Por que arden os nosos montes?',
      heroHeadline: 'Por que arden os nosos montes?',
      heroKicker: 'Un verán extremo, moita vexetación acumulada e unha paisaxe que xa non se comporta como antes.<span class="mobile-break"></span> Co apoio dos datos tentaremos comprender por que os incendios seguen golpeando con tanta forza o noroeste peninsular.',
      scrollHint: 'Despraza para explorar',
      heroPhotoCredit: 'FOTO: Pedro Armestre',
      mapSource: 'Fonte: forest-fire.emergency.copernicus.eu/',
      sliderCaption: 'Fonte: Comparador do Plan Nacional de Ortofotografía Aérea',
      categoryAriaLabel: 'Selecciona unha categoría de información',
      categoryDefault: 'Escolle unha categoría para coñecer como inflúe na propagación do lume.',
      categoryTabs: {
        geologia: 'Xeoloxía',
        vegetacion: 'Vexetación',
        clima: 'Clima',
        geografia: 'Xeografía'
      },
      climateAlts: {
        larouco: 'Clima en Larouco',
        fases: 'Fases do clima'
      },
      heroFinal: {
        headline: 'Temos que aprender a convivir co lume, pero aínda podemos facer máis…',
        paragraphs: [
          'Non existe unha solución máxica. Hai que aceptar que o lume continuará formando parte da nosa realidade, e máis aínda co cambio climático. A prioridade é reducir o seu impacto e adaptarnos, antes que buscar culpables fáciles.',
          'A resposta é complexa e require visión a longo prazo: máis xestión da paisaxe, máis pastoreo adaptativo, prevención activa na interface urbano-forestal, educación para convivir co lume… e moito máis.',
          'O lume é un fenómeno natural: con frecuencia negativo e tráxico para as persoas, os bens e os modos de vida, pero tamén positivo para o rexuvenecemento e a dinámica dos ecosistemas. Comprendelo é clave para aprender a convivir con el.'
        ],
        photoCredit: 'FOTO: Pedro Armestre'
      },
      categoryContent: {
        geologia: {
          title: 'Xeoloxía',
          text: '<h2>Xeoloxía</h2>Nesta capa podemos ver a <strong>litoloxía</strong> do sueste de Galicia. A maior parte do territorio está formada por <strong>rochas metamórficas</strong> e <strong>graníticas</strong>, que dan lugar a <strong>solos ácidos</strong>.<br>Eses solos favorecen comunidades vexetais máis <strong>inflamables</strong> pola composición dos seus tecidos.<br><br><strong>Lenda:</strong><br><span style="color: #e7298a;">■</span> DEPÓSITOS DETRÍTICOS CUATERNARIOS<br><span style="color: #1b9e77;">■</span> DEPÓSITOS DETRÍTICOS TERCIARIOS<br><span style="color: #e6ab02;">■</span> DEPÓSITOS PLIOCUATERNARIOS<br><span style="color: #8cf0b7;">■</span> ROCHAS CARBONATADAS<br><span style="color: #51e723;">■</span> ROCHAS FILONIANAS<br><span style="color: #d95f02;">■</span> ROCHAS GRANÍTICAS<br><span style="color: #7570b3;">■</span> ROCHAS METAMÓRFICAS<br><br><div style="text-align: right; font-style: italic; color: #666; font-size: 12px;">Fonte: SERGAS</div>'
        },
        vegetacion: {
          title: 'Vexetación',
          text: '<h2>Vexetación</h2>Esta capa amosa os <strong>usos do solo</strong> no sueste de Galicia. Destaca o claro predominio da <strong>matogueira</strong>, moi por enriba doutros usos como o <strong>mosaico agroforestal</strong>, as <strong>zonas de cultivo</strong> ou os pequenos <strong>bosques</strong> e <strong>plantacións forestais</strong>. Esta distribución é clave para entender a cantidade e a continuidade do <strong>combustible vexetal</strong>, factores decisivos na propagación dos incendios.<br><br><strong>Lenda:</strong><br><span style="color: #a6cee3;">■</span> MOSAICO AGROFORESTAL<br><span style="color: #1f78b4;">■</span> TURBEIRA<br><span style="color: #b2df8a;">■</span> PLANTACIÓN FORESTAL<br><span style="color: #33a02c;">■</span> BOSQUE<br><span style="color: #fb9a99;">■</span> AGROSISTEMA EXTENSIVO<br><span style="color: #e31a1c;">■</span> SUPERFICIE DE CULTIVO<br><span style="color: #fdbf6f;">■</span> MATOGUEIRA E ROCHAS<br><span style="color: #ff7f00;">■</span> EXTRACTIVO<br><span style="color: #cab2d6;">■</span> VIÑEDO<br><br><div style="text-align: right; font-style: italic; color: #666; font-size: 12px;">Fonte: SERGAS</div>'
        },
        clima: {
          title: 'Clima',
          text: '<h2>Clima</h2>Este gráfico amosa as <strong>precipitacións</strong>, a <strong>temperatura</strong> e o <strong>NDVI</strong> (un índice que mide a actividade da vexetación) rexistrados na estación de <strong>Larouco</strong>, na zona do incendio.<br><br>Obsérvanse dúas fases ben definidas:<br><br>🌧 <strong>Estación chuviosa</strong>: abundantes choivas e temperaturas moderadas reducen o risco de incendio e favorecen unha alta produtividade vexetal, acumulando biomasa.<br><br>☀️ <strong>Estación seca</strong>: co aumento prolongado das temperaturas apréciase unha caída do <strong>NDVI</strong> —a vexetación sécase—, a reserva de combustible é elevada e o risco disprárase.<br><br>Este patrón encaixa con <strong>climas mediterráneos húmidos</strong>, <strong>tropicais estacionais</strong> ou certos <strong>climas continentais</strong>, onde o lume forma parte da dinámica natural do ecosistema.'
        },
        geografia: {
          title: 'Xeografía',
          text: '<h2>Xeografía</h2>No mapa apréciase un <strong>relevo montañoso e moi recortado</strong>, con vales profundos e ladeiras escarpadas que caracterizan boa parte do interior de Galicia.<br><br>A <strong>xeografía</strong> inflúe de maneira decisiva no comportamento do lume:<br><br><strong>Relevo abrupto</strong>: as pendentes dificultan o acceso dos equipos de extinción e facilitan que as lapas ascendan con rapidez.<br><br><strong>Ventos irregulares e fortes</strong>: en zonas montañosas as correntes de aire cambian de dirección con facilidade, o que pode desviar bruscamente o avance do incendio.'
        }
      },
      chapters: {
        'incendios-2025': {
          title: '',
          description: `
            <h2>Un verán para <s style="color: rgba(255, 255, 255, 0.64);">esquecer</s> <strong>reaccionar</strong></h2>
            Os incendios do verán de <strong>2025</strong> quedarán gravados na <strong>historia de Galicia</strong>.<br>
            Nunca antes se rexistrara unha <strong>superficie tan extensa arrasada</strong> polas chamas.<br>
            O incendio de <strong>Larouco–Seadur</strong>, con máis de <strong>31.700 hectáreas</strong> (317 km²), foi o <strong>maior visto nunca</strong> na nosa comunidade.<br><br>
            Para comprender a súa magnitude convén lembrar a diferenza entre un <strong>incendio forestal</strong> e un <strong>gran incendio forestal (GIF)</strong>: o primeiro pode afectar só a unhas poucas hectáreas, mentres que o segundo supera as <strong>500 hectáreas</strong>. O lume de Larouco multiplicou por máis de <strong>60</strong> ese limiar.<br><br>
            Mais os números poden enganarnos e afastarnos do problema: como dimensionar algo tan enorme? Un xeito é comparar o incendio cun entorno que coñezamos, como <strong>as nosas cidades</strong>.<br>
            <br>Para entender mellor a súa magnitude, o seguinte gráfico compara a área queimada coa superficie municipal de varias cidades coñecidas.
            <iframe src="https://flo.uri.sh/visualisation/26265364/embed"
                    frameborder="0"
                    scrolling="no"
                    style="width: 100%; height: 560px; margin-top: 12px;">
            </iframe>
          `
        },
        'tendencia-aumento': {
          title: '',
          description: `
            <h2>Unha tendencia en <strong>aumento</strong></h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <iframe src="https://flo.uri.sh/visualisation/25013636/embed" 
                                frameborder="0" 
                                scrolling="no" 
                                style="width: 100%; height: 600px; margin-bottom: 30px;">
                        </iframe>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  O gráfico mostra como evolucionaron os <strong>incendios forestais</strong> en Galicia desde 2016.<br><br>
  É interactivo: podes seleccionar os datos para ver a información en detalle e ocultar categorías facendo clic na lenda.<br><br>
  Ao longo do período repítese un patrón claro: anos de <strong>relativa calma</strong> seguidos doutros moito máis <strong>severos</strong>.<br><br>
  <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> marcan picos importantes, pero <strong>2025</strong> supera todos os rexistros.<br><br>
  Aínda que o número de incendios fluctúa, as <strong>hectáreas afectadas</strong> tenden a aumentar en cada repunte.<br><br>
  En conxunto, a serie reflicte unha <strong>tendencia ascendente</strong> e un agravamento progresivo dos <strong>grandes incendios</strong>.
                          </p>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        
                        <div class="only-desktop">
                          <iframe src="https://flo.uri.sh/visualisation/25015393/embed" 
                                  frameborder="0" 
                                  scrolling="no" 
                                  style="width: 100%; height: 600px;">
                          </iframe>
                        </div>
                        <div class="only-mobile">
                          <iframe src="https://flo.uri.sh/visualisation/26398232/embed"
                                  frameborder="0"
                                  scrolling="no"
                                  style="width: 100%; height: 600px;">
                          </iframe>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        <div class="mobile-expl">
                          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  O mapa permite visualizar de forma interactiva a distribución dos <strong>incendios forestais</strong> en Galicia entre 2016 e 2025.<br><br>
  Os círculos representan a magnitude dos incendios e a súa localización, mentres que a liña inferior mostra a evolución anual.<br><br>
  A maior concentración mantense no sur da comunidade, especialmente na provincia de <strong>Ourense</strong>, que actúa como epicentro recorrente.<br><br>
  Nos anos <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> os focos multiplícanse, e en <strong>2025</strong> a superficie queimada acada valores excepcionais.<br><br>
  Os datos evidencian un patrón de recorrencia: os incendios tenden a repetirse nas mesmas zonas, cunha intensidade cada vez maior.<br><br>
  Máis que episodios illados, reflicten un proceso sostido que amplifica o seu impacto co paso do tempo.
                          </p>
                        </div>
                    </div>
                    
                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.72; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  O gráfico mostra como evolucionaron os <strong>incendios forestais</strong> en Galicia desde 2016.<br><br>
  É interactivo: podes seleccionar os datos para ver a información en detalle e ocultar categorías facendo clic na lenda.<br><br>
  Ao longo do período repítese un patrón claro: anos de <strong>relativa calma</strong> seguidos doutros moito máis <strong>severos</strong>.<br><br>
  <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> marcan picos importantes, pero <strong>2025</strong> supera todos os rexistros.<br><br>
  Aínda que o número de incendios fluctúa, as <strong>hectáreas afectadas</strong> tenden a aumentar en cada repunte.<br><br>
  En conxunto, a serie reflicte unha <strong>tendencia ascendente</strong> e un agravamento progresivo dos <strong>grandes incendios</strong>.
                        </p>
                        
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.63;">
  O mapa permite visualizar de forma interactiva a distribución dos <strong>incendios forestais</strong> en Galicia entre 2016 e 2025.<br><br>
  Os círculos representan a magnitude dos incendios e a súa localización, mentres que a liña inferior mostra a evolución anual.<br><br>
  A maior concentración mantense no sur da comunidade, especialmente na provincia de <strong>Ourense</strong>, que actúa como epicentro recorrente.<br><br>
  Nos anos <strong>2017</strong>, <strong>2020</strong> e <strong>2022</strong> os focos multiplícanse, e en <strong>2025</strong> a superficie queimada acada valores excepcionais.<br><br>
  Os datos evidencian un patrón de recorrencia: os incendios tenden a repetirse nas mesmas zonas, cunha intensidade cada vez maior.<br><br>
  Máis que episodios illados, reflicten un proceso sostido que amplifica o seu impacto co paso do tempo.
                        </p>
                    </div>
                </div>
          `
        },
        'galicia-noroeste': {
          title: '',
          description: `
            <h2>Por que Galicia e o Noroeste?</h2>
            <p>Escolle unha das categorías para explorar os factores que explican por que esta rexión é especialmente vulnerable aos incendios forestais.</p>
            <div id="category-mobile-slot" class="category-mobile-slot"></div>
            <div id="layer-explanation" class="layer-explanation">
                <h3 id="layer-title" style="margin: 0 0 12px 0; color: #F44E11; display: none;"></h3>
                <p id="layer-description" style="margin: 0; line-height: 1.6;">Escolle unha categoría para coñecer como inflúe na propagación do lume.</p>
            </div>
            <div id="climate-inline-container" class="climate-inline" style="display:none;">
                <img src="assets/Larouco_Clima.png" alt="Clima en Larouco" class="climate-inline-large" />
                <img src="assets/Fases_Clima.png" alt="Fases do clima" class="climate-inline-small" />
            </div>
          `
        },
        'tendencia-comparativas': {
          title: '',
          description: `
            <h2>As causas detrás do lume</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <iframe src="https://flo.uri.sh/visualisation/25942041/embed"
                                frameborder="0"
                                scrolling="no"
                                style="width: 100%; height: 600px; margin-bottom: 30px;">
                        </iframe>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante máis de cinco décadas, os incendios en Ourense tiveron un denominador común: a maioría foron provocados.<br><br>
O gráfico amosa como os <strong>lumes intencionados</strong> (en laranxa) dominan case toda a serie histórica, seguidos dos casos con <strong>causa descoñecida</strong>.<br><br>
As <strong>queimas agrícolas e gandeiras</strong>, moi ligadas ao uso tradicional do lume para limpar ou preparar terreos, e as neglixencias aparecen en menor medida, mentres que os <strong>incendios naturais</strong> apenas teñen presenza.<br><br>
En resumo, o lume en Ourense case nunca empeza só: detrás hai <strong>decisións humanas</strong>, ás veces por costume e outras por conflito.
                          </p>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        <iframe src="https://flo.uri.sh/visualisation/25510523/embed"
                                frameborder="0"
                                scrolling="no"
                                style="width: 100%; height: 600px;">
                        </iframe>
                        <div class="mobile-expl">
                          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Detrás de cada incendio intencionado hai un motivo, e en Ourense a maioría gardan relación co campo.<br><br>
As <strong>prácticas agrícolas e gandeiras</strong> explican boa parte dos lumes provocados, seguidas por casos de <strong>alarma social</strong>, <strong>piromanía</strong> ou <strong>vinganzas persoais</strong>.<br><br>
Aínda así, milleiros de hectáreas arden por causas que non chegan a coñecerse, mostra da dificultade que supón investigar este tipo de incendios.<br><br>
Entre 1968 e 2020, máis de <strong>12.000 hectáreas</strong> foron arrasadas só por lumes de orixe intencionada.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante máis de cinco décadas, os incendios en Ourense tiveron un denominador común: a maioría foron provocados.<br><br>
O gráfico amosa como os <strong>lumes intencionados</strong> (en laranxa) dominan case toda a serie histórica, seguidos dos casos con <strong>causa descoñecida</strong>.<br><br>
As <strong>queimas agrícolas e gandeiras</strong> —moi ligadas ao uso tradicional do lume para limpar ou preparar terreos— e as neglixencias aparecen en menor medida, mentres que os <strong>incendios naturais</strong> apenas teñen presenza.<br><br>
En resumo, o lume en Ourense case nunca empeza só: detrás hai <strong>decisións humanas</strong>, ás veces por costume e outras por conflito.
                        </p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
Detrás de cada incendio intencionado hai un motivo, e en Ourense a maioría gardan relación co campo.<br><br>
As <strong>prácticas agrícolas e gandeiras</strong> explican boa parte dos lumes provocados, seguidas por casos de <strong>alarma social</strong>, <strong>piromanía</strong> ou <strong>vinganzas persoais</strong>.<br><br>
Aínda así, milleiros de hectáreas arden por causas que non chegan a coñecerse, mostra da dificultade que supón investigar este tipo de incendios.<br><br>
Entre 1968 e 2020, máis de <strong>12.000 hectáreas</strong> foron arrasadas só por lumes de orixe intencionada.
                        </p>
                    </div>
                </div>
          `
        },
        'cimadevila-comparacion': {
          title: '',
          description: `
            <h2>Afastámonos do monte</h2>
                <div class="cimadevila-layout" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div class="vertical-slider-container">
                            <div class="vertical-slider-wrapper">
                                <img class="vertical-slider-img vertical-slider-img-bottom" src="assets/cimadevila_1957.png" alt="Cimadevila 1957">
                                <div class="vertical-slider-overlay">
                                    <img class="vertical-slider-img vertical-slider-img-top" src="assets/cimadevila_2021.png" alt="Cimadevila 2021">
                                </div>
                                <div class="vertical-slider-handle" id="cimadevila-slider">
                                    <div class="vertical-slider-handle-icon"></div>
                                </div>
                                <div class="vertical-slider-labels">
                                    <span class="vertical-slider-label-top">1957</span>
                                    <span class="vertical-slider-label-bottom">2020</span>
                                </div>
                            </div>
                            <p class="slider-caption">
                                Fonte: Comparador do Plan Nacional de Ortofotografía Aérea
                            </p>
                        </div>
                    </div>
                    
                    <div class="cimadevila-text-panel">
                        <div class="cimadevila-text-inner">
                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                                Neste exemplo, en <strong>Cimadevila</strong> (Nogueira de Ramuín), vese con claridade como cambiou a paisaxe galega en poucas décadas.<br><br>
                                Sabemos que moitos incendios están relacionados con <strong>prácticas agrícolas e gandeiras</strong>. E non, a maioría das veces non hai mala intención: trátase de costumes herdadas, dunha forma tradicional de manexar o territorio.<br><br>
                                O problema é que o monte xa non se comporta como antes.<br><br>
                                Durante o último medio século pasamos de <strong>mosaicos abertos e pastoreados</strong> (campos, hortas, prados) a <strong>masas forestais pechadas</strong>, onde o combustible vexetal se acumula.<br><br>
                                Quen segue empregando o lume "como toda a vida" faino nunha paisaxe completamente distinta, e unha simple queima que antes se controlaba con facilidade hoxe pode converterse nun incendio desbocado.
                            </p>
                        </div>
                    </div>
                </div>
          `
        },
        'mapa-calor-causas': {
          title: '',
          description: `
            <h2>O verán alóngase… e o lume tamén</h2>
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
                            Todo isto ocorre nun contexto de cambio climático que aumenta o risco e amplía a tempada de incendios. Neste gráfico podemos ver como mudaron as temperaturas en Galicia desde os anos 40.<br><br>
                            A medida que avanza a serie temporal, os meses fríos van perdendo o ton azul que representa as temperaturas baixas. Esa cor, tan presente nas primeiras décadas, atenúase pouco a pouco ata case desaparecer nas últimas. En paralelo, os veráns vólvense máis cálidos e prolongados, e o vermello ocupa cada vez máis espazo no mapa de cor.<br><br>
                            Este desprazamento cromático representa un quecemento real que amplía a duración das condicións estivais e, con elas, o período de maior risco de incendio. As temperaturas máis altas, sumadas a unha vexetación cada vez máis seca, xeran un escenario no que calquera chispa ten máis posibilidades de converterse nun lume.
                        </p>
                        
                        <div class="only-desktop">
                            <iframe src="https://flo.uri.sh/visualisation/26020279/embed" 
                                    frameborder="0" 
                                    scrolling="no" 
                                    style="width: 100%; height: 720px;">
                            </iframe>
                        </div>

                        <div class="only-mobile">
                            <iframe src="https://flo.uri.sh/visualisation/26412913/embed"
                                    frameborder="0"
                                    scrolling="no"
                                    style="width: 100%; height: 720px;">
                            </iframe>
                        </div>
                        
                        <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6;">
                            Os estudos sobre ondas de calor mostran que estes fenómenos extremos non só aumentan en frecuencia, senón tamén en intensidade e duración.<br><br>
                            Neste contexto, prácticas que antes eran relativamente seguras, como as <strong>queimas agrícolas e gandeiras</strong>, convértense nun risco elevado cando coinciden con períodos de alta temperatura, baixa humidade e ventos intensos.<br><br>
                            A combinación de combustible vexetal acumulado, condicións meteorolóxicas adversas e prácticas tradicionais que non se adaptan ao novo escenario climático explica por que os incendios son cada vez máis devastadores.
                        </p>
                    </div>
                </div>
          `
        }
      }
    }
  };

  var original = {};
  var chapterRefs = {};
  var currentLanguage = 'es';
  var languageSelector = null;
  var categoryTabsContainer = null;
  var layerDescriptionEl = null;

  function deepClone(value) {
    if (value === undefined || value === null) return value;
    if (typeof window.structuredClone === 'function') {
      try {
        return window.structuredClone(value);
      } catch (error) {}
    }
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (err) {
      return value;
    }
  }

  function forEachNode(list, callback) {
    if (!list || typeof callback !== 'function') return;
    Array.prototype.forEach.call(list, callback);
  }

  function captureOriginals() {
    languageSelector = document.getElementById('language-selector');
    categoryTabsContainer = document.querySelector('.category-tabs');
    layerDescriptionEl = document.getElementById('layer-description');

    original.htmlLang = document.documentElement.getAttribute('lang') || 'es';
    original.pageTitle = document.title;
    original.languageSelectorLabel = languageSelector ? languageSelector.getAttribute('aria-label') : '';
    var topbarTitle = document.getElementById('titleRight');
    original.topbarTitle = topbarTitle ? topbarTitle.textContent.trim() : '';
    var heroHeadlineEl = document.querySelector('#hero .hero-headline');
    original.heroHeadline = heroHeadlineEl ? heroHeadlineEl.textContent : '';
    var heroKickerEl = document.querySelector('#hero .hero-kicker p');
    original.heroKicker = heroKickerEl ? heroKickerEl.innerHTML : '';
    var scrollHintEl = document.querySelector('#hero .scroll-hint');
    original.scrollHint = scrollHintEl ? scrollHintEl.textContent : '';
    var heroPhotoCreditEl = document.querySelector('#hero .photo-credit');
    original.heroPhotoCredit = heroPhotoCreditEl ? heroPhotoCreditEl.textContent : '';
    var mapSourceEl = document.querySelector('.map-source');
    original.mapSource = mapSourceEl ? mapSourceEl.textContent : '';
    var sliderCaptionEl = document.querySelector('.slider-caption');
    original.sliderCaption = sliderCaptionEl ? sliderCaptionEl.textContent : '';
    var heroFinalHeadlineEl = document.querySelector('#hero-final .hero-headline');
    original.heroFinalHeadline = heroFinalHeadlineEl ? heroFinalHeadlineEl.textContent : '';
    var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
    original.heroFinalParagraphs = [];
    forEachNode(heroFinalParagraphs, function (node) {
      original.heroFinalParagraphs.push(node.innerHTML);
    });
    var heroFinalCreditEl = document.querySelector('#hero-final .photo-credit');
    original.heroFinalPhotoCredit = heroFinalCreditEl ? heroFinalCreditEl.textContent : '';
    original.categoryDefault = layerDescriptionEl ? layerDescriptionEl.innerHTML : '';
    original.categoryTabs = {};
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (key) {
        original.categoryTabs[key] = btn.textContent.trim();
      }
    });
    original.categoryAriaLabel = categoryTabsContainer ? categoryTabsContainer.getAttribute('aria-label') : '';
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    original.climateAlts = {
      larouco: laroucoImg ? laroucoImg.getAttribute('alt') : '',
      fases: fasesImg ? fasesImg.getAttribute('alt') : ''
    };
    original.categoryContent = deepClone(window.categoryContent);
    original.chapters = {};
    if (window.config && Array.isArray(window.config.chapters)) {
      window.config.chapters.forEach(function (record) {
        var container = document.getElementById(record.id);
        if (!container) return;
        var titleEl = container.querySelector('h3');
        var descEl = container.querySelector('p');
        chapterRefs[record.id] = {
          container: container,
          titleEl: titleEl,
          descriptionEl: descEl
        };
        original.chapters[record.id] = {
          title: titleEl ? titleEl.textContent : '',
          description: descEl ? descEl.innerHTML : ''
        };
      });
    }
  }

  function updateChaptersContent(contentMap) {
    if (!contentMap) return;
    Object.keys(chapterRefs).forEach(function (id) {
      var refs = chapterRefs[id];
      if (!refs) return;
      var data = contentMap[id];
      if (!data) return;

      if (data.title !== undefined) {
        if (refs.titleEl) {
          refs.titleEl.textContent = data.title || '';
          refs.titleEl.style.display = data.title ? '' : 'none';
        } else if (data.title) {
          var newTitle = document.createElement('h3');
          newTitle.textContent = data.title;
          if (refs.descriptionEl) {
            refs.descriptionEl.parentNode.insertBefore(newTitle, refs.descriptionEl);
          } else {
            refs.container.appendChild(newTitle);
          }
          refs.titleEl = newTitle;
        }
      }

      if (refs.descriptionEl && data.description !== undefined) {
        refs.descriptionEl.innerHTML = data.description;
      }
    });
  }

  function refreshCategoryExplanation() {
    if (typeof window.updateLayerExplanation !== 'function') return;
    var active = window.currentCategory || null;
    if (!active) {
      var pressed = document.querySelector('.category-tab[aria-pressed="true"]');
      if (pressed) {
        active = pressed.getAttribute('data-category');
      }
    }
    window.updateLayerExplanation(active || null);
  }

  function setCategoryContentData(data) {
    if (!data) return;
    window.categoryContent = deepClone(data);
    refreshCategoryExplanation();
  }

  function setElementText(target, value) {
    if (value === undefined) return;
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.textContent = value;
    }
  }

  function setElementHTML(target, value) {
    if (value === undefined) return;
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.innerHTML = value;
    }
  }

  function applyOriginals(skipSelectorUpdate) {
    document.documentElement.setAttribute('lang', original.htmlLang || 'es');
    document.title = original.pageTitle || document.title;
    setElementText('#titleRight', original.topbarTitle);
    setElementText('#hero .hero-headline', original.heroHeadline);
    setElementHTML('#hero .hero-kicker p', original.heroKicker);
    setElementText('#hero .scroll-hint', original.scrollHint);
    setElementText('#hero .photo-credit', original.heroPhotoCredit);
    setElementText('.map-source', original.mapSource);
    setElementText('.slider-caption', original.sliderCaption);
    setElementText('#hero-final .hero-headline', original.heroFinalHeadline);
    var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
    forEachNode(heroFinalParagraphs, function (node, idx) {
      if (original.heroFinalParagraphs[idx] !== undefined) {
        node.innerHTML = original.heroFinalParagraphs[idx];
      }
    });
    setElementText('#hero-final .photo-credit', original.heroFinalPhotoCredit);
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (original.categoryTabs && original.categoryTabs[key]) {
        btn.textContent = original.categoryTabs[key];
      }
    });
    if (categoryTabsContainer && original.categoryAriaLabel !== undefined) {
      categoryTabsContainer.setAttribute('aria-label', original.categoryAriaLabel);
    }
    if (languageSelector && original.languageSelectorLabel !== undefined) {
      languageSelector.setAttribute('aria-label', original.languageSelectorLabel);
    }
    if (layerDescriptionEl && original.categoryDefault !== undefined) {
      layerDescriptionEl.innerHTML = original.categoryDefault;
    }
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    if (laroucoImg && original.climateAlts) {
      laroucoImg.setAttribute('alt', original.climateAlts.larouco || '');
    }
    if (fasesImg && original.climateAlts) {
      fasesImg.setAttribute('alt', original.climateAlts.fases || '');
    }
    setCategoryContentData(original.categoryContent);
    updateChaptersContent(original.chapters);
    if (!skipSelectorUpdate) {
      updateLanguageSelectorUI('es');
    }
  }

  function applyTranslations(dict) {
    if (!dict) return;
    document.documentElement.setAttribute('lang', dict.htmlLang || 'gl');
    document.title = dict.pageTitle || document.title;
    setElementText('#titleRight', dict.topbarTitle);
    setElementText('#hero .hero-headline', dict.heroHeadline);
    setElementHTML('#hero .hero-kicker p', dict.heroKicker);
    setElementText('#hero .scroll-hint', dict.scrollHint);
    setElementText('#hero .photo-credit', dict.heroPhotoCredit);
    setElementText('.map-source', dict.mapSource);
    setElementText('.slider-caption', dict.sliderCaption);
    if (dict.heroFinal) {
      setElementText('#hero-final .hero-headline', dict.heroFinal.headline);
      var heroFinalParagraphs = document.querySelectorAll('#hero-glass-panel p');
      forEachNode(heroFinalParagraphs, function (node, idx) {
        if (dict.heroFinal.paragraphs && dict.heroFinal.paragraphs[idx] !== undefined) {
          node.innerHTML = dict.heroFinal.paragraphs[idx];
        }
      });
      if (dict.heroFinal.photoCredit !== undefined) {
        setElementText('#hero-final .photo-credit', dict.heroFinal.photoCredit);
      }
    }
    forEachNode(document.querySelectorAll('.category-tab'), function (btn) {
      var key = btn.getAttribute('data-category');
      if (dict.categoryTabs && dict.categoryTabs[key]) {
        btn.textContent = dict.categoryTabs[key];
      }
    });
    if (categoryTabsContainer && dict.categoryAriaLabel) {
      categoryTabsContainer.setAttribute('aria-label', dict.categoryAriaLabel);
    }
    if (languageSelector && dict.languageSelectorLabel) {
      languageSelector.setAttribute('aria-label', dict.languageSelectorLabel);
    }
    if (layerDescriptionEl && dict.categoryDefault !== undefined) {
      layerDescriptionEl.innerHTML = dict.categoryDefault;
    }
    var laroucoImg = document.getElementById('larouco-clima-img');
    var fasesImg = document.getElementById('fases-clima-img');
    if (laroucoImg && dict.climateAlts && dict.climateAlts.larouco) {
      laroucoImg.setAttribute('alt', dict.climateAlts.larouco);
    }
    if (fasesImg && dict.climateAlts && dict.climateAlts.fases) {
      fasesImg.setAttribute('alt', dict.climateAlts.fases);
    }
    if (dict.categoryContent) {
      setCategoryContentData(dict.categoryContent);
    }
    updateChaptersContent(dict.chapters);
  }

  function updateLanguageSelectorUI(lang) {
    forEachNode(document.querySelectorAll('#language-selector .language-button'), function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.classList.toggle('language-button--active', !!isActive);
    });
  }

  function setLanguage(lang) {
    if (lang === currentLanguage) return;
    if (lang === 'es') {
      applyOriginals();
    } else if (lang === 'gl' && translations.gl) {
      applyTranslations(translations.gl);
    } else {
      return;
    }
    currentLanguage = lang;
    updateLanguageSelectorUI(lang);
  }

  function initLanguageSelector() {
    if (!languageSelector) return;
    languageSelector.addEventListener('click', function (event) {
      var target = event.target.closest('button[data-lang]');
      if (!target) return;
      setLanguage(target.getAttribute('data-lang'));
    });
  }

  captureOriginals();
  applyOriginals(true);
  initLanguageSelector();
  updateLanguageSelectorUI(currentLanguage);

  window.setStoryLanguage = setLanguage;
})();

