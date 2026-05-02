var config = {
    style: 'mapbox://styles/miguel-ferr/cmf4jek5100hv01plgk8pe1lg',
    accessToken: 'pk.eyJ1IjoibWlndWVsLWZlcnIiLCJhIjoiY21pbnI4dWhmMGVjaTNncjEwcTl5NjVmeiJ9.6vtKRrzI4kxzFDiHNFOgpg',
    
    // Capas que se ocultan automáticamente por defecto
    hiddenLayers: ['USOURENSE', 'XEOURENSE', 'RELIEVE'],
    
    // Explicaciones de las categorías
    layerExplanations: {
        'geologia': {
            title: 'Geología',
            description: 'La composición del suelo y subsuelo influye directamente en la retención de humedad y la facilidad de propagación del fuego.<br>Los suelos más secos y rocosos favorecen la expansión rápida de las llamas.'
        },
        'vegetacion': {
            title: 'Vegetación',
            description: 'Los tipos de bosque y matorral predominantes determinan la cantidad de combustible disponible para el fuego.<br>Las especies más resinosas y la densidad de la vegetación son factores críticos en la intensidad de los incendios.'
        },
        'clima': {
            title: 'Clima',
            description: 'Las condiciones meteorológicas extremas como sequías prolongadas, vientos fuertes y altas temperaturas crean el escenario perfecto.<br>Los períodos secos y las olas de calor multiplican exponencialmente el riesgo de incendio.'
        },
        'geografia': {
            title: 'Geografía',
            description: 'El relieve y la topografía del terreno afectan tanto la velocidad como la dirección de propagación del fuego.<br>Las pendientes pronunciadas y los valles estrechos actúan como corredores que aceleran las llamas.'
        }
    },
    
    // Explicaciones de las categorías
    layerExplanations: {
        'geologia': {
            title: 'Geología',
            description: 'La composición del suelo y subsuelo influye directamente en la retención de humedad y la facilidad de propagación del fuego.<br>Los suelos más secos y rocosos favorecen la expansión rápida de las llamas.'
        },
        'vegetacion': {
            title: 'Vegetación',
            description: 'Los tipos de bosque y matorral predominantes determinan la cantidad de combustible disponible para el fuego.<br>Las especies más resinosas y la densidad de la vegetación son factores críticos en la intensidad de los incendios.'
        },
        'clima': {
            title: 'Clima',
            description: 'Las condiciones meteorológicas extremas como sequías prolongadas, vientos fuertes y altas temperaturas crean el escenario perfecto.<br>Los períodos secos y las olas de calor multiplican exponencialmente el riesgo de incendio.'
        },
        'geografia': {
            title: 'Geografía',
            description: 'El relieve y la topografía del terreno afectan tanto la velocidad como la dirección de propagación del fuego.<br>Las pendientes pronunciadas y los valles estrechos actúan como corredores que aceleran las llamas.'
        }
    },
    
    chapters: [
        {
            id: 'incendios-2025',
            alignment: 'left',   
            hidden: false,
            title: '',
            description: `
            <h2>Un verano para <s style="color: rgba(255, 255, 255, 0.64);">olvidar</s> <strong>reaccionar</strong></h2>
            Los incendios del verano de <strong>2025</strong> quedarán marcados en la <strong>historia de Galicia</strong>.<br>
            Nunca antes se había registrado una <strong>superficie tan extensa arrasada</strong> por las llamas.<br>
            El incendio de <strong>Larouco–Seadur</strong>, con más de <strong>31.700 hectáreas</strong> (317 km²), ha sido el <strong>mayor jamás visto</strong> en nuestra comunidad.<br><br>

            Para poder entender su magnitud conviene primero explicar la diferencia entre un <strong>incendio forestal</strong> y un <strong>gran incendio forestal (GIF)</strong>: el primero puede afectar a pocas hectáreas, el segundo es aquel que supera las <strong>500 hectáreas</strong>. El incendio de Larouco multiplicó por más de <strong>60</strong> ese umbral.<br><br>

            Pero los números pueden confundirnos y abstraernos del problema: ¿cómo dimensionamos algo tan enorme? Una forma es comparar el incendio con un entorno que conozcamos, como<strong> nuestras ciudades</strong>.<br><br>
            Para dimensionar su magnitud, el siguiente gráfico compara el área quemada con la superficie municipal de varias ciudades conocidas.<br><br>

            <iframe src="https://flo.uri.sh/visualisation/26265364/embed"
                    frameborder="0"
                    scrolling="no"
                    style="width: 100%; height: 560px; margin-top: 12px;">
            </iframe>
`,

            
            location: {
                center: [-8.723, 42.827],
                zoom: 7.4,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
    { callbackName: 'hideDefaultLayers' },
    { layer: 'FIRES_GLOW_POINT_1', opacity: 1, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_2', opacity: 1, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_3', opacity: 1, duration: 2400 },
    { layer: 'FIRES_PERIMETER',    opacity: 1, duration: 2400 },

    // <<< Aparece el texto-marcador a la vez que el fuego (con el mismo “tempo”)
    { callbackName: 'showLarouco', delay: 3600 } // usa delay: 2400 si quieres esperar al desvanecido
  ],
  onChapterExit: [
    { layer: 'FIRES_GLOW_POINT_1', opacity: 0, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_2', opacity: 0, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_3', opacity: 0, duration: 2400 },
    { layer: 'FIRES_PERIMETER',    opacity: 0, duration: 2400 },

    // <<< Oculta el marcador al salir del capítulo
    { callbackName: 'hideLarouco', delay: 2400 }
            ]
        },
        {
            id: 'tendencia-aumento',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>Una tendencia en <strong>aumento</strong></h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-tendencia" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <!-- Explicación 1 (visible en móvil) -->
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  Hablar de incendios en Galicia depende mucho de quién los cuente.<br><br>
  Si miramos los datos del satélite (<strong>EFFIS</strong>), los grandes fuegos saltan a la vista, pero la mayoría de los pequeños se nos escapan: solo recoge los que dejan una huella suficientemente visible desde el espacio.<br><br>
  El registro <strong>oficial de la Xunta</strong> los recoge todos. Y ahí los números cambian de orden: en años recientes hay más de <strong>1.000 incendios al año</strong>, no las pocas decenas que ve el satélite.<br><br>
  Los picos siguen estando en <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong>, pero <strong>2025</strong> rompe todas las escalas: cerca de <strong>120.000 hectáreas</strong> arrasadas en una sola temporada.<br><br>
  No es solo que ardan más hectáreas: es que los grandes incendios pesan cada vez más dentro del total.
                          </p>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        
                        <!-- Versión escritorio del mapa (Flourish original) -->
                        <div class="only-desktop">
                          <iframe src="https://flo.uri.sh/visualisation/25015393/embed" 
                                  frameborder="0" 
                                  scrolling="no" 
                                  style="width: 100%; height: 600px;">
                          </iframe>
                        </div>
                        <!-- Versión móvil del mapa (Flourish móvil con zoom más alejado) -->
                        <div class="only-mobile">
                          <iframe src="https://flo.uri.sh/visualisation/26398232/embed"
                                  frameborder="0"
                                  scrolling="no"
                                  style="width: 100%; height: 600px;">
                          </iframe>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        <!-- Explicación 2 (visible en móvil) -->
                        <div class="mobile-expl">
                          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  El mapa permite visualizar de forma interactiva la distribución de los <strong>incendios forestales</strong> en Galicia entre 2016 y 2025.<br><br>
  Los círculos representan la magnitud de los incendios y su localización, mientras la línea inferior muestra la evolución anual.<br><br>
  La mayor concentración se mantiene en el sur de la comunidad, especialmente en la provincia de <strong>Ourense</strong>, que actúa como epicentro recurrente.<br><br>
  En los años <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong> los focos se multiplican, y en <strong>2025</strong> la extensión quemada alcanza valores excepcionales.<br><br>
  Los datos evidencian un patrón de recurrencia: los incendios tienden a repetirse en las mismas zonas, con una intensidad cada vez mayor.<br><br>
  Más que episodios aislados, reflejan un proceso sostenido que amplifica su impacto con el paso del tiempo.
                          </p>
                        </div>
                    </div>
                    
                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.72; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  Hablar de incendios en Galicia depende mucho de quién los cuente.<br><br>
  Si miramos los datos del satélite (<strong>EFFIS</strong>), los grandes fuegos saltan a la vista, pero la mayoría de los pequeños se nos escapan: solo recoge los que dejan una huella suficientemente visible desde el espacio.<br><br>
  El registro <strong>oficial de la Xunta</strong> los recoge todos. Y ahí los números cambian de orden: en años recientes hay más de <strong>1.000 incendios al año</strong>, no las pocas decenas que ve el satélite.<br><br>
  Los picos siguen estando en <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong>, pero <strong>2025</strong> rompe todas las escalas: cerca de <strong>120.000 hectáreas</strong> arrasadas en una sola temporada.<br><br>
  No es solo que ardan más hectáreas: es que los grandes incendios pesan cada vez más dentro del total.
                        </p>

                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.63;">
  El mapa permite visualizar de forma interactiva la distribución de los <strong>incendios forestales</strong> en Galicia entre 2016 y 2025.<br><br>
  Los círculos representan la magnitud de los incendios y su localización, mientras la línea inferior muestra la evolución anual.<br><br>
  La mayor concentración se mantiene en el sur de la comunidad, especialmente en la provincia de <strong>Ourense</strong>, que actúa como epicentro recurrente.<br><br>
  En los años <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong> los focos se multiplican, y en <strong>2025</strong> la extensión quemada alcanza valores excepcionales.<br><br>
  Los datos evidencian un patrón de recurrencia: los incendios tienden a repetirse en las mismas zonas, con una intensidad cada vez mayor.<br><br>
  Más que episodios aislados, reflejan un proceso sostenido que amplifica su impacto con el paso del tiempo.
                        </p>
                    </div>
                </div>
            `,
            location: {
                center: [-8.723, 42.827],
                zoom: 7.4,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'renderTendencia' }
            ],
            onChapterExit: []
        },
        {
            id: 'galicia-noroeste',
            alignment: 'left',
            hidden: false,
            title: '',
            description: `
            <h2>¿Por qué Galicia y el Noroeste?</h2>
            <p>Selecciona una de las categorías para explorar los factores que explican por qué esta región es especialmente vulnerable a los incendios forestales.</p>
            <div id="category-mobile-slot" class="category-mobile-slot"></div>
            
            <!-- Contenido dinámico que cambia según la capa seleccionada -->
            <div id="layer-explanation" class="layer-explanation">
                <h3 id="layer-title" style="margin: 0 0 12px 0; color: #F44E11; display: none;"></h3>
                <p id="layer-description" style="margin: 0; line-height: 1.6;">Haz tu selección en el menú superior.</p>
            </div>
            <div id="climate-inline-container" class="climate-inline" style="display:none;">
                <img src="assets/Larouco_Clima.png" alt="Clima en Larouco" class="climate-inline-large" />
                <img src="assets/Fases_Clima.png" alt="Fases del clima" class="climate-inline-small" />
            </div>
            `,
            location: {
                center: [-7.915, 42.289],
                zoom: 8.74,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'showCategorySelector' }
            ],
            onChapterExit: [
                { callbackName: 'hideCategorySelector' }
            ]
        },
        {
            id: 'tendencia-comparativas',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>Las causas detrás del fuego</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-causas" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante más de cinco décadas, los incendios en Ourense han tenido un denominador común: la mayoría fueron provocados.<br><br>
Sobre el conjunto de los <strong>81.643 partes oficiales</strong> registrados entre <strong>1968 y 2022</strong>, casi <strong>8 de cada 10</strong> son intencionados; el resto se reparte entre causa desconocida (14%), negligencias (4%), reproducciones de incendios anteriores y rayo (apenas un 1,5% cada uno).<br><br>
Cuando se mira <strong>dentro del grupo de los intencionados</strong>, el patrón se vuelve más nítido: en torno al <strong>43%</strong> son <strong>quemas agrícolas o ganaderas</strong> que se descontrolan, muy ligadas al uso tradicional del fuego para limpiar o preparar terrenos. Caza, vandalismo, piromanía o venganzas suman porcentajes mucho menores.<br><br>
Y aun así, casi la mitad de los partes intencionados no llegan a tener una motivación reconocida: investigar este tipo de incendios es complicado.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
Durante más de cinco décadas, los incendios en Ourense han tenido un denominador común: la mayoría fueron provocados.<br><br>
Sobre el conjunto de los <strong>81.643 partes oficiales</strong> registrados entre <strong>1968 y 2022</strong>, casi <strong>8 de cada 10</strong> son intencionados; el resto se reparte entre causa desconocida (14%), negligencias (4%), reproducciones y rayo (apenas un 1,5% cada uno).<br><br>
Cuando se mira <strong>dentro del grupo de los intencionados</strong>, el patrón se vuelve más nítido: en torno al <strong>43%</strong> son <strong>quemas agrícolas o ganaderas</strong> que se descontrolan, muy ligadas al uso tradicional del fuego para limpiar o preparar terrenos. Caza, vandalismo, piromanía o venganzas suman porcentajes mucho menores.<br><br>
Y aun así, casi la mitad de los partes intencionados no llegan a tener una motivación reconocida: investigar este tipo de incendios es complicado.
                        </p>
                    </div>
                </div>
            `,
            location: {
                center: [-8.723, 42.827],
                zoom: 7.4,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'renderCausas' }
            ],
            onChapterExit: []
        },
        {
            id: 'propiedade-monte',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>De quién son los montes que arden</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-propiedade" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
La propiedad del monte gallego es una rareza en el contexto estatal. Cerca de un tercio del territorio forestal está organizado como <strong>monte vecinal en mano común</strong> (MVMC): tierras gestionadas colectivamente por los vecinos de una parroquia desde antes de las desamortizaciones, devueltas a sus comunidades por la Lei 13/1989.<br><br>
Los <strong>3.290 montes vecinales</strong> clasificados suman <strong>660.000 hectáreas</strong> — un <strong>22,3%</strong> del territorio gallego, casi todas concentradas en Ourense y Lugo.<br><br>
Cuando se cruza el registro MVMC con los <strong>1.475 incendios</strong> que documentó PrazaGal en 2025, el contraste es claro: <strong>el 39% de las hectáreas estimadas quemadas</strong> cae sobre MVMC, casi el doble del peso que les correspondería por superficie. Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) o Castro de Escuadro (74%) están entre las parroquias más castigadas — y son justamente las de mayor concentración vecinal.<br><br>
La explicación tiene poco que ver con el régimen jurídico en sí: las comunidades de montes han sido históricamente uno de los pocos agentes que aún hacen gestión activa del monte. La correlación habla, sobre todo, de <strong>dónde queda el monte</strong>: en las parroquias rurales del interior orensano, vaciadas por el éxodo, donde la propiedad colectiva sobrevive porque el minifundio privado se abandonó.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
La propiedad del monte gallego es una rareza en el contexto estatal. Cerca de un tercio del territorio forestal está organizado como <strong>monte vecinal en mano común</strong> (MVMC): tierras gestionadas colectivamente por los vecinos de una parroquia desde antes de las desamortizaciones, devueltas a sus comunidades por la Lei 13/1989.<br><br>
Los <strong>3.290 montes vecinales</strong> clasificados suman <strong>660.000 hectáreas</strong> — un <strong>22,3%</strong> del territorio gallego, casi todas concentradas en Ourense y Lugo.<br><br>
Cuando se cruza el registro MVMC con los <strong>1.475 incendios</strong> que documentó PrazaGal en 2025, el contraste es claro: <strong>el 39% de las hectáreas estimadas quemadas</strong> cae sobre MVMC, casi el doble del peso que les correspondería por superficie.<br><br>
Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) o Castro de Escuadro (74%) están entre las parroquias más castigadas — y son justamente las de mayor concentración vecinal.<br><br>
La explicación tiene poco que ver con el régimen jurídico en sí: las comunidades de montes han sido históricamente uno de los pocos agentes que aún hacen gestión activa del monte. La correlación habla, sobre todo, de <strong>dónde queda el monte</strong>: en las parroquias rurales del interior orensano, vaciadas por el éxodo, donde la propiedad colectiva sobrevive porque el minifundio privado se abandonó.
                        </p>
                    </div>
                </div>
            `,
            location: {
                center: [-7.85, 42.45],
                zoom: 7.6,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'renderPropiedade' }
            ],
            onChapterExit: []
        },
        {
            id: 'cimadevila-comparacion',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>Nos hemos alejado del monte</h2>
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
                                Fuente: Comparador del Plan Nacional de Ortografía Aérea
                            </p>
                        </div>
                    </div>
                    
                    <div class="cimadevila-text-panel">
                        <div class="cimadevila-text-inner">
                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                                En este ejemplo, en <strong>Cimadevila</strong> (Nogueira de Ramuín), se ve claro cómo ha cambiado el paisaje gallego en apenas unas décadas.<br><br>
                                Sabemos que muchos incendios están relacionados con <strong>prácticas agrícolas y ganaderas</strong>. Y no, la mayoría de las veces no hay mala intención: se trata de costumbres heredadas, de una forma tradicional de manejar el territorio.<br><br>
                                El problema es que el monte ya no se comporta como antes.<br><br>
                                Durante el último medio siglo hemos pasado de <strong>mosaicos abiertos y pastoreados</strong> (campos, huertas, prados) a <strong>masas forestales cerradas</strong>, donde el combustible vegetal se acumula.<br><br>
                                Quienes siguen usando el fuego "como toda la vida" lo hacen en un paisaje completamente distinto, y una simple quema que antes se controlaba fácilmente hoy puede convertirse en un incendio desbocado.
                            </p>
                        </div>
                    </div>
                </div>
            `,
            location: {
                center: [-8.723, 42.827],
                zoom: 7.4,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'initCimadevilaSlider' }
            ],
            onChapterExit: []
        },
        {
            id: 'mapa-calor-causas',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>El verano se alarga… y el fuego también</h2>
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
                            Todo esto ocurre en un contexto de cambio climático que aumenta el riesgo y extiende la temporada de incendios. En este gráfico podemos ver cómo han cambiado las temperaturas en Galicia desde los años 40.<br><br>
                            A medida que avanza la serie temporal, los meses fríos van perdiendo el tono azul que representa las temperaturas bajas. Ese color, tan presente en las primeras décadas, se atenúa poco a poco hasta casi pasar a blanco en los últimos años. Paralelamente, los veranos se vuelven más cálidos y prolongados, ocupando el rojo cada vez más espacio en el mapa de color.<br><br>
                            Este desplazamiento cromático representa un calentamiento real que amplía la duración de las condiciones estivales y, con ellas, el periodo de mayor riesgo de incendio. Las temperaturas más altas, sumadas a una vegetación cada vez más seca, generan un escenario en el que cualquier chispa tiene más posibilidades de convertirse en un fuego.
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
                            Los estudios sobre olas de calor muestran que estos fenómenos extremos no solo aumentan en frecuencia, sino también en intensidad y duración.<br><br>
                            En este contexto, prácticas que antes eran relativamente seguras, como las <strong>quemas agrícolas y ganaderas</strong>, se convierten en un riesgo elevado cuando coinciden con períodos de alta temperatura, baja humedad y vientos intensos.<br><br>
                            La combinación de combustible vegetal acumulado, condiciones meteorológicas adversas y prácticas tradicionales que no se adaptan al nuevo escenario climático explica por qué los incendios son cada vez más devastadores.
                        </p>
                    </div>
                </div>
            `,
            location: {
                center: [-8.723, 42.827],
                zoom: 7.4,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' }
            ],
            onChapterExit: []
        }
    ]
};
