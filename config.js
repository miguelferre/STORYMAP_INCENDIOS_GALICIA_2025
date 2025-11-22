var config = {
    style: 'mapbox://styles/miguel-ferr/cmf4jek5100hv01plgk8pe1lg',
    accessToken: 'pk.eyJ1IjoibWlndWVsLWZlcnIiLCJhIjoiY21mMnh6eGt1MmY0ejJrcXl2czZtODBhcCJ9.jHIrIN7QvT1D6khuxCsLDg',
    
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

            Para poder entender su magnitud primero conviene explicar la diferencia entre un <strong>incendio forestal</strong> y un <strong>gran incendio forestal (GIF)</strong>: el primero puede afectar a pocas hectáreas, el segundo es aquel que supera las <strong>500 hectáreas</strong>. El indendio deLarouco multiplicó por más de <strong>60</strong> ese umbral.<br><br>

            Pero los números pueden confundirnos y abstraernos del problema: ¿cómo dimensionamos algo tan enorme? Una forma es comparar el incendio con un entorno que conozcámos, como<strong> nuestras ciudades</strong>.<br>
            <br>Para dimensionar su magnitud, el siguiente gráfico compara el área quemada con la superficie municipal de varias ciudades conocidas.

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
                        <iframe src="https://flo.uri.sh/visualisation/25013636/embed" 
                                frameborder="0" 
                                scrolling="no" 
                                style="width: 100%; height: 600px; margin-bottom: 30px;">
                        </iframe>
                        <!-- Explicación 1 (visible en móvil) -->
                        <div class="mobile-expl">
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  El gráfico muestra cómo han evolucionado los <strong>incendios forestales</strong> en Galicia desde 2016.<br><br>
  Es interactivo: permite explorar cada año y observar cómo cambian las cifras de incendios y de <strong>superficie quemada</strong>.<br><br>
  A lo largo del periodo se repite un patrón claro: años de <strong>relativa calma</strong> seguidos de otros mucho más <strong>severos</strong>.<br><br>
  <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong> marcan picos importantes, pero <strong>2025</strong> supera todos los registros.<br><br>
  Aunque el número de incendios fluctúa, las <strong>hectáreas afectadas</strong> tienden a aumentar con cada repunte.<br><br>
  En conjunto, la serie refleja una <strong>tendencia ascendente</strong> y un agravamiento progresivo de los <strong>grandes incendios</strong>.
                          </p>
                        </div>
                        
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
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
  El gráfico muestra cómo han evolucionado los <strong>incendios forestales</strong> en Galicia desde 2016.<br><br>
  Es interactivo: permite explorar cada año y observar cómo cambian las cifras de incendios y de <strong>superficie quemada</strong>.<br><br>
  A lo largo del periodo se repite un patrón claro: años de <strong>relativa calma</strong> seguidos de otros mucho más <strong>severos</strong>.<br><br>
  <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong> marcan picos importantes, pero <strong>2025</strong> supera todos los registros.<br><br>
  Aunque el número de incendios fluctúa, las <strong>hectáreas afectadas</strong> tienden a aumentar con cada repunte.<br><br>
  En conjunto, la serie refleja una <strong>tendencia ascendente</strong> y un agravamiento progresivo de los <strong>grandes incendios</strong>.
                        </p>
<br><br>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
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
                { callbackName: 'hideDefaultLayers' }
            ],
            onChapterExit: []
        },
        {
            id: 'nuevo-capitulo',
            alignment: 'left',
            hidden: false,
            title: '',
            description: `
            <h2>¿Por qué Galicia y el Noroeste?</h2>
            <p>Usa el selector superior para explorar los factores que explican por qué esta región es especialmente vulnerable a los incendios forestales.</p>
            
            <!-- Contenido dinámico que cambia según la capa seleccionada -->
            <div id="layer-explanation" style="margin-top: 20px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <h3 id="layer-title" style="margin: 0 0 12px 0; color: #F44E11; display: none;"></h3>
                <p id="layer-description" style="margin: 0; line-height: 1.6;">Selecciona una categoría para conocer cómo influye en la propagación del fuego.</p>
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
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <iframe src="https://flo.uri.sh/visualisation/25942041/embed"
                                frameborder="0"
                                scrolling="no"
                                style="width: 100%; height: 600px; margin-bottom: 30px;">
                        </iframe>

                        <iframe src="https://flo.uri.sh/visualisation/25510523/embed"
                                frameborder="0"
                                scrolling="no"
                                style="width: 100%; height: 600px;">
                        </iframe>
                    </div>

                    <div style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
                            Durante más de cinco décadas, los incendios en Ourense han tenido un denominador común: la mayoría fueron provocados.<br><br>
                            El gráfico muestra cómo los <strong>fuegos intencionados</strong> (en naranja) dominan casi toda la serie histórica, seguidos de los casos con <strong>causa desconocida</strong>.<br><br>
                            Las <strong>quemas agrícolas y ganaderas</strong> —muy ligadas al uso tradicional del fuego para limpiar o preparar terrenos— y las negligencias aparecen en menor medida, mientras que los <strong>incendios naturales</strong> apenas tienen presencia.<br><br>
                            En resumen, el fuego en Ourense casi nunca empieza solo: tiene detrás <strong>decisiones humanas</strong>, a veces por costumbre y otras por conflicto.
                        </p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            Detrás de cada incendio intencionado hay un motivo, y en Ourense la mayoría tienen relación con el campo.<br><br>
                            Las <strong>prácticas agrícolas y ganaderas</strong> explican buena parte de los fuegos provocados, seguidas por casos de <strong>alarma social</strong>, <strong>piromanía</strong> o <strong>venganzas personales</strong>.<br><br>
                            Aun así, miles de hectáreas arden por causas que no llegan a conocerse, reflejo de lo difícil que es investigar este tipo de incendios.<br><br>
                            Entre 1968 y 2020, más de <strong>12.000 hectáreas</strong> fueron arrasadas solo por incendios con origen intencionado.
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
        },
        {
            id: 'cimadevila-comparacion',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>Nos hemos alejado del monte</h2>
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
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
                            <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 1.4; font-style: italic; text-align: right; color: rgba(255, 255, 255, 0.7); background: none !important; border: none !important; padding: 0 !important; box-shadow: none !important; backdrop-filter: none !important; border-radius: 0 !important;">
                                Fuente: Comparador del Plan Nacional de Ortografía Aérea
                            </p>
                        </div>
                    </div>
                    
                    <div style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <div style="padding: 16px; background: none; border-radius: 8px;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.6;">
                                En este ejemplo, en <strong>Cimadevila</strong> (Nogueira de Ramuín), se ve claro cómo ha cambiado el paisaje gallego en apenas unas décadas.<br><br>
                                Sabemos que muchos incendios están relacionados con <strong>prácticas agrícolas y ganaderas</strong>. Y no, la mayoría de las veces no hay mala intención: se trata de costumbres heredadas, de una forma tradicional de manejar el territorio.<br><br>
                                El problema es que el monte ya no se comporta como antes.<br><br>
                                Durante el último medio siglo hemos pasado de <strong>mosaicos abiertos y pastoreados</strong> —campos, huertas, prados— a <strong>masas forestales cerradas</strong>, donde el combustible vegetal se acumula.<br><br>
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
            <h2>Mapa de calor de causas</h2>
                <div style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.8; background: none; backdrop-filter: blur(20px); border-radius: 8px; padding: 12px 16px;">
                            Estamos en un contexto de <strong>cambio climático</strong>, donde las condiciones meteorológicas extremas se vuelven más frecuentes e intensas. Las <strong>olas de calor</strong>, las sequías prolongadas y los vientos fuertes crean el escenario perfecto para que cualquier chispa se convierta en un incendio descontrolado.<br><br>
                            El mapa de calor muestra la distribución temporal y espacial de las causas de los incendios forestales. Los colores más intensos indican períodos y zonas donde se concentran más incendios, permitiendo identificar patrones y correlaciones entre las condiciones climáticas extremas y el origen de los fuegos.
                        </p>
                        
                        <iframe src="https://flo.uri.sh/visualisation/26020279/embed" 
                                frameborder="0" 
                                scrolling="no" 
                                style="width: 100%; height: 720px;">
                        </iframe>
                        
                        <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6;">
                            Los estudios sobre olas de calor muestran que estos fenómenos extremos no solo aumentan en frecuencia, sino también en intensidad y duración. En este contexto, prácticas que antes eran relativamente seguras —como las <strong>quemas agrícolas y ganaderas</strong>— se convierten en un riesgo elevado cuando coinciden con períodos de alta temperatura, baja humedad y vientos intensos. La combinación de combustible vegetal acumulado, condiciones meteorológicas adversas y prácticas tradicionales que no se adaptan al nuevo escenario climático explica por qué los incendios son cada vez más devastadores.
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
