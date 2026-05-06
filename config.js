var config = {
    style: 'mapbox://styles/miguel-ferr/cmf4jek5100hv01plgk8pe1lg',
    accessToken: '__MAPBOX_TOKEN__',
    
    // Capas que se ocultan automáticamente por defecto
    hiddenLayers: ['USOURENSE', 'XEOURENSE', 'LITOLOGIA_GALICIA', 'RELIEVE'],
    
    layerExplanations: {
        'geologia': {
            title: 'Geología',
            description: 'Galicia es un mosaico dominado por <strong>rocas ácidas</strong> (granitos y esquistos paleozoicos, ~84% del territorio), con afloramientos puntuales de <strong>básicas y carbonatadas</strong> en Cabo Ortegal (~11%) y <strong>depósitos sedimentarios recientes</strong> en las cuencas terciarias de As Pontes y Monforte (~5%).<br>Los sustratos siliciclásticos dan suelos ácidos que favorecen vegetaciones más inflamables.'
        },
        'vegetacion': {
            title: 'Vegetación',
            description: 'Los tipos de vegetación determinan la cantidad, continuidad y peligrosidad del combustible. Las 18 clases del IET (Xunta, 2011, 1:500.000) se reagrupan en siete categorías: <strong>bosque autóctono</strong>, <strong>eucalipto</strong>, <strong>pino/coníferas</strong>, <strong>matorral</strong>, <strong>agrario e rural</strong>, <strong>urbano e industrial</strong> y <strong>augas e rochedo</strong>.'
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
            <div class="portada-card">
              <h2>Un verano para <s style="color: rgba(255, 255, 255, 0.64);">olvidar</s> <strong>reaccionar</strong></h2>
              <p class="portada-parrafo">
                Los incendios del verano de <strong>2025</strong> quedarán marcados en la <strong>historia de Galicia</strong>. Nunca antes se había registrado una <strong>superficie tan extensa arrasada</strong> por las llamas. El incendio de <strong>Larouco–Seadur</strong>, con más de <strong>31.700 hectáreas</strong> (317 km²), ha sido el <strong>mayor jamás visto</strong> en nuestra comunidad.
              </p>
              <p class="portada-parrafo">
                Para entender su magnitud conviene primero explicar la diferencia entre un <strong>incendio forestal</strong> y un <strong>gran incendio forestal (GIF)</strong>: el primero puede afectar a pocas hectáreas, el segundo es aquel que supera las <strong>500 hectáreas</strong>. Larouco multiplicó por más de <strong>60</strong> ese umbral.
              </p>
              <p class="portada-parrafo">
                Pero los números pueden abstraernos del problema. Una forma de dimensionar algo tan enorme es compararlo con un entorno que conozcamos, como <strong>nuestras ciudades</strong>. El siguiente gráfico compara el área quemada con la superficie municipal de varias ciudades conocidas.
              </p>
              <div id="grafica-comparador" class="grafica-host" style="margin-top: 12px;"></div>
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
    { layer: 'FIRES_GLOW_POINT_1', opacity: 1, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_2', opacity: 1, duration: 2400 },
    { layer: 'FIRES_GLOW_POINT_3', opacity: 1, duration: 2400 },
    { layer: 'FIRES_PERIMETER',    opacity: 1, duration: 2400 },

    // <<< Aparece el texto-marcador a la vez que el fuego (con el mismo “tempo”)
    { callbackName: 'showLarouco', delay: 3600 }, // usa delay: 2400 si quieres esperar al desvanecido
    { callbackName: 'renderComparador' }
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
            id: 'dia-xuntou-todo',
            alignment: 'full',
            hidden: false,
            title: '',
            description: `
            <h2>El día que se juntó todo</h2>
                <div class="chapter2-flex" style="display: flex; gap: 30px; align-items: flex-start; background: none; border: none;">
                    <div style="flex: 2; background: none; border: none; backdrop-filter: none;">
                        <div id="grafica-cronoloxia" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div id="grafica-era5-agosto" class="grafica-host" style="margin-bottom: 30px;"></div>
                        <div class="mobile-expl">
                          <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.7; background: none;">
Larouco-Seadur fue el incendio más grande, pero no estuvo solo. La gráfica resume todo el periodo crítico, del <strong>1 de julio al 1 de octubre de 2025</strong>: cada barra naranja es la suma de hectáreas reportadas ese día por PrazaGal, y cada círculo amarillo es uno de los <strong>35 incendios mayores de 100 ha</strong> que ocurrieron en esos tres meses.<br><br>
La lectura es brutal: durante junio y julio Galicia mantiene niveles bajos, pero entre el <strong>8 y el 15 de agosto</strong> se concentra prácticamente toda la siniestralidad. En esa única semana se solapan <strong>Oímbra (22.317 ha)</strong>, Larouco (23.527 ha), <strong>Chandrexa de Queixa (12.784 ha)</strong>, A Mezquita (10.743 ha) y Quiroga (9.472 ha), agotando los recursos de extinción de toda la comunidad.<br><br>
El día más demoledor fue el <strong>12 de agosto</strong>, con <strong>32 incendios activos y casi 49.000 hectáreas reportadas</strong>. El 13 se sumaron 25.000 más. En cinco días ardieron <strong>más de 100.000 hectáreas</strong>, la mayor parte de todo el daño anual.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.7; background: none;">
Larouco-Seadur fue el incendio más grande, pero no estuvo solo. La gráfica resume todo el periodo crítico, del <strong>1 de julio al 1 de octubre de 2025</strong>: cada barra naranja es la suma de hectáreas reportadas ese día por PrazaGal, y cada círculo amarillo es uno de los <strong>35 incendios mayores de 100 ha</strong> que ocurrieron en esos tres meses, con su tamaño proporcional a las hectáreas que arrasaron.<br><br>
La lectura es brutal: durante junio y julio Galicia mantiene niveles bajos, pero entre el <strong>8 y el 15 de agosto</strong> se concentra prácticamente toda la siniestralidad del verano. En esa única semana se solapan <strong>Oímbra (22.317 ha)</strong>, Larouco (23.527 ha), <strong>Chandrexa de Queixa (12.784 ha)</strong>, A Mezquita (10.743 ha) y Quiroga (9.472 ha), agotando los recursos de extinción de toda la comunidad.<br><br>
El día más demoledor fue el <strong>12 de agosto</strong>, con <strong>32 incendios activos y casi 49.000 hectáreas reportadas</strong>. El 13 se sumaron otras 25.000. En cinco días ardieron <strong>más de 100.000 hectáreas</strong>, la mayor parte de todo el daño anual.<br><br>
Tras el pico, septiembre se desinfla. Una sola semana decidió un verano entero.<br><br>
Los gráficos de abajo muestran por qué esa semana fue posible. Los datos son del reanálisis ERA5 del ECMWF, filtrados a la zona interior de Ourense, no de toda Galicia, donde la lluvia en A Coruña distorsionaría el cuadro. <strong>Del 1 al 11 de agosto</strong>, el termómetro no bajó de 28°C de máxima y acumuló once días seguidos por encima de 30°C. El pico fue el <strong>10 de agosto: 33.7°C</strong>. En esa misma franja, la precipitación fue <strong>prácticamente cero</strong>: las barras casi no llegan a la línea de referencia de la media histórica de agosto en Ourense (~0.8 mm/día). La poca lluvia que cayó el 12 de agosto llegó cuando los grandes incendios ya llevaban horas activos.
                        </p>
                    </div>
                </div>
            `,
            location: {
                center: [-7.4, 42.4],
                zoom: 7.8,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'renderCronoloxia' },
                { callbackName: 'renderERA5Agosto' }
            ],
            onChapterExit: []
        },
        {
            id: 'pegada-lume',
            alignment: 'left',
            hidden: false,
            title: '',
            description: `
            <h2>La huella del fuego</h2>
            <div class="pegada-text-group">
              <p style="font-size: 15px; line-height: 1.65;">
              El satélite lo recuerda todo. Comparando imágenes Sentinel-2 antes y después del fuego (24 jul vs 10 oct 2025), el índice <strong>dNBR</strong> mide cuánta vegetación se perdió. Los rojos más intensos señalan los focos donde la cubierta vegetal desapareció por completo y el suelo quedó expuesto: allí la recuperación natural tardará <strong>décadas</strong>. Los tonos más suaves indican daños menores, donde la vegetación puede regenerarse en pocos años.
              </p>
              <p style="font-size: 15px; line-height: 1.65; margin-top: 10px;">
              Las líneas violetas y azules marcan la <strong>Wildland-Urban Interface</strong> (WUI): el borde donde el bosque y el matorral combustible llegan hasta casas, granjas y pastos. No son zonas despobladas. De las más de 24.000 ha quemadas, <strong>472 ha de WUI</strong> ardieron con severidad moderada o alta. El fuego no solo arrasó el monte: cruzó la frontera hacia donde vive la gente.
              </p>
              <div id="grafica-dnbr" class="grafica-host" style="margin: 12px 0 0 0;"></div>
            </div>
            <div id="grafica-dnbr-bars" class="grafica-host" style="margin-top: 8px;"></div>
            `,
            location: {
                center: window.innerWidth < 480 ? [-7.073, 42.470] : [-7.22, 42.39],
                zoom: window.innerWidth < 480 ? 9.3 : 10.8,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            onChapterEnter: [
                { callbackName: 'hideDefaultLayers' },
                { callbackName: 'showDnbrLayer' },
                { callbackName: 'showWuiLayer' },
                { callbackName: 'renderDnbr' }
            ],
            onChapterExit: [
                { callbackName: 'hideDnbrLayer' },
                { callbackName: 'hideWuiLayer' }
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
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none;">
  Hablar de incendios en Galicia depende mucho de quién los cuente.<br><br>
  Si miramos los datos del satélite (<strong>EFFIS</strong>), los grandes fuegos saltan a la vista, pero la mayoría de los pequeños se nos escapan: solo recoge los que dejan una huella suficientemente visible desde el espacio.<br><br>
  El registro <strong>oficial de la Xunta</strong> los recoge todos. Y ahí los números cambian de orden: en años recientes hay más de <strong>1.000 incendios al año</strong>, no las pocas decenas que ve el satélite.<br><br>
  Los picos siguen estando en <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong>, pero <strong>2025</strong> rompe todas las escalas: cerca de <strong>120.000 hectáreas</strong> arrasadas en una sola temporada.<br><br>
  No es solo que ardan más hectáreas: es que los grandes incendios pesan cada vez más dentro del total.
                          </p>
                        </div>
                        <br class="only-mobile"><br class="only-mobile">
                        
                        <div id="grafica-mapa-tendencia" class="grafica-host"></div>
                        <br class="only-mobile"><br class="only-mobile">
                        <!-- Explicación 2 (visible en móvil) -->
                        <div class="mobile-expl">
                          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; background: none;">
  El segundo gráfico desglosa el mismo problema en el espacio. Cada celda es la superficie quemada en uno de los <strong>19 distritos forestales de Galicia</strong> en un año concreto, entre 2018 y 2025. Cuanto más cálido el color, más hectáreas perdidas.<br><br>
  El patrón es nítido: las cinco filas superiores (<strong>Valdeorras-Trives, Verín-Viana, Terra de Lemos, A Limia y Miño-Arnoia</strong>) concentran prácticamente toda la actividad año tras año. Los cinco pertenecen al <strong>sureste de Ourense</strong>, el epicentro estructural de los incendios en la comunidad.<br><br>
  La columna de <strong>2025</strong> destaca especialmente: Valdeorras-Trives roza los 40.000 ha en un solo año, una intensidad que no aparece en ningún otro punto de la serie.<br><br>
  Los incendios no se reparten al azar: se repiten en los mismos distritos, con una intensidad creciente.
                          </p>
                        </div>
                    </div>
                    
                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.72; background: none;">
  Hablar de incendios en Galicia depende mucho de quién los cuente.<br><br>
  Si miramos los datos del satélite (<strong>EFFIS</strong>), los grandes fuegos saltan a la vista, pero la mayoría de los pequeños se nos escapan: solo recoge los que dejan una huella suficientemente visible desde el espacio.<br><br>
  El registro <strong>oficial de la Xunta</strong> los recoge todos. Y ahí los números cambian de orden: en años recientes hay más de <strong>1.000 incendios al año</strong>, no las pocas decenas que ve el satélite.<br><br>
  Los picos siguen estando en <strong>2017</strong>, <strong>2020</strong> y <strong>2022</strong>, pero <strong>2025</strong> rompe todas las escalas: cerca de <strong>120.000 hectáreas</strong> arrasadas en una sola temporada.<br><br>
  No es solo que ardan más hectáreas: es que los grandes incendios pesan cada vez más dentro del total.
                        </p>

                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.63; background: none;">
  El segundo gráfico desglosa el mismo problema en el espacio. Cada celda es la superficie quemada en uno de los <strong>19 distritos forestales de Galicia</strong> en un año concreto, entre 2018 y 2025. Cuanto más cálido el color, más hectáreas perdidas.<br><br>
  El patrón es nítido: las cinco filas superiores (<strong>Valdeorras-Trives, Verín-Viana, Terra de Lemos, A Limia y Miño-Arnoia</strong>) concentran prácticamente toda la actividad año tras año. Los cinco pertenecen al <strong>sureste de Ourense</strong>, el epicentro estructural de los incendios en la comunidad.<br><br>
  La columna de <strong>2025</strong> destaca especialmente: Valdeorras-Trives roza los 40.000 ha en un solo año, una intensidad que no aparece en ningún otro punto de la serie. Los incendios no se reparten al azar: se repiten en los mismos distritos, con una intensidad creciente.
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
                { callbackName: 'renderTendencia' },
                { callbackName: 'renderMapaTendencia' }
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
                <div id="clima-larouco-host-mobile" style="width:100%;"></div>
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
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none;">
Durante más de cinco décadas, los incendios en Ourense han tenido un denominador común: la mayoría fueron provocados.<br><br>
Sobre el conjunto de los <strong>81.643 partes oficiales</strong> registrados entre <strong>1968 y 2022</strong>, casi <strong>8 de cada 10</strong> son intencionados; el resto se reparte entre causa desconocida (14%), negligencias (4%), reproducciones de incendios anteriores y rayo (apenas un 1,5% cada uno).<br><br>
Cuando se mira <strong>dentro del grupo de los intencionados</strong>, el patrón se vuelve más nítido: en torno al <strong>43%</strong> son <strong>quemas agrícolas o ganaderas</strong> escapadas, muy ligadas al uso tradicional del fuego para limpiar o regenerar pastos. El resto de motivaciones tienen perfiles distintos: <strong>caza</strong> (renovar pasto cinegético o forzar movimiento de fauna), <strong>venganzas y disputas</strong> (rivalidades vecinales, conflictos por linderos), <strong>vandalismo</strong> (destrucción sin móvil instrumental), <strong>piromanía</strong> (trastorno psiquiátrico, impulso compulsivo), <strong>desacuerdos y protestas</strong> (contra políticas forestales o expropiaciones), <strong>propiedad</strong> (forzar cambio de uso del suelo) y <strong>beneficio económico</strong> (intereses indirectos).<br><br>
Y aun así, casi la mitad de los partes intencionados no llegan a tener una motivación reconocida: investigar este tipo de incendios es complicado.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none;">
Durante más de cinco décadas, los incendios en Ourense han tenido un denominador común: la mayoría fueron provocados.<br><br>
Sobre el conjunto de los <strong>81.643 partes oficiales</strong> registrados entre <strong>1968 y 2022</strong>, casi <strong>8 de cada 10</strong> son intencionados; el resto se reparte entre causa desconocida (14%), negligencias (4%), reproducciones y rayo (apenas un 1,5% cada uno).<br><br>
Dentro del grupo intencionado, en torno al <strong>43%</strong> son <strong>quemas agrícolas o ganaderas</strong> escapadas, ligadas al uso tradicional del fuego para limpiar o regenerar pastos. Las demás motivaciones recogidas en el catálogo EGIF tienen perfiles propios: <strong>caza</strong> (renovar pasto cinegético o forzar movimiento de fauna), <strong>venganzas y disputas</strong> (rivalidades vecinales, conflictos por linderos), <strong>vandalismo</strong> (destrucción sin móvil instrumental), <strong>piromanía</strong> (trastorno psiquiátrico con impulso compulsivo), <strong>desacuerdos y protestas</strong> (contra políticas forestales o expropiaciones), <strong>propiedad</strong> (forzar cambio de uso del suelo) y <strong>beneficio económico</strong> (intereses indirectos en contratos o aprovechamiento posterior).<br><br>
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
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none;">
La propiedad del monte gallego es una rareza en el contexto estatal. Cerca de un tercio del territorio forestal está organizado como <strong>monte vecinal en mano común</strong> (MVMC): tierras gestionadas colectivamente por los vecinos de una parroquia desde antes de las desamortizaciones, devueltas a sus comunidades por la Lei 13/1989.<br><br>
Los <strong>3.290 montes vecinales</strong> clasificados suman <strong>660.000 hectáreas</strong>, un <strong>22,3%</strong> del territorio gallego, casi todas concentradas en Ourense y Lugo.<br><br>
Cuando se cruza el registro MVMC con los <strong>1.475 incendios</strong> que documentó PrazaGal en 2025, el contraste es claro: <strong>el 39% de las hectáreas estimadas quemadas</strong> cae sobre MVMC, casi el doble del peso que les correspondería por superficie. Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) o Castro de Escuadro (74%) están entre las parroquias más castigadas. Son justamente las de mayor concentración vecinal.<br><br>
A nivel parroquia el patrón se suaviza: sobre las <strong>825 parroquias con al menos un incendio</strong>, la <strong>correlación de Spearman</strong> entre %MVMC y hectáreas quemadas es de <strong>ρ ≈ 0,09</strong> (0,15 con la superficie en escala logarítmica). Spearman mide si dos variables se mueven juntas en orden. El valor 0 indica sin relación, +1 una relación creciente perfecta y −1 decreciente perfecta. <strong>0,09 es muy débil</strong>: la propiedad colectiva por sí sola no explica el fuego, hace falta saber dónde está esa propiedad. Lo que sí cambia con claridad es la cola de fuegos grandes: en las parroquias con ≥20% de MVMC la <strong>media de hectáreas quemadas es de 272 ha</strong> frente a las <strong>62 ha</strong> del resto.<br><br>
La explicación tiene poco que ver con el régimen jurídico en sí: las comunidades de montes han sido históricamente uno de los pocos agentes que aún hacen gestión activa del monte. La correlación habla, sobre todo, de <strong>dónde queda el monte</strong>: en las parroquias rurales del interior orensano, vaciadas por el éxodo, donde la propiedad colectiva sobrevive porque el minifundio privado se abandonó. La estimación de hectáreas sobre MVMC es proporcional al peso de MVMC en cada parroquia, una aproximación honesta a falta de los perímetros oficiales.
                          </p>
                        </div>
                    </div>

                    <div class="desktop-expl" style="flex: 1; background: none; border: none; backdrop-filter: none;">
                        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.8; background: none;">
La propiedad del monte gallego es una rareza en el contexto estatal. Cerca de un tercio del territorio forestal está organizado como <strong>monte vecinal en mano común</strong> (MVMC): tierras gestionadas colectivamente por los vecinos de una parroquia desde antes de las desamortizaciones, devueltas a sus comunidades por la Lei 13/1989.<br><br>
Los <strong>3.290 montes vecinales</strong> clasificados suman <strong>660.000 hectáreas</strong>, un <strong>22,3%</strong> del territorio gallego, casi todas concentradas en Ourense y Lugo.<br><br>
Cuando se cruza el registro MVMC con los <strong>1.475 incendios</strong> que documentó PrazaGal en 2025, el contraste es claro: <strong>el 39% de las hectáreas estimadas quemadas</strong> cae sobre MVMC, casi el doble del peso que les correspondería por superficie.<br><br>
Casaio (88% MVMC), Parafita (80%), Vilanuíde (56%) o Castro de Escuadro (74%) están entre las parroquias más castigadas. Son justamente las de mayor concentración vecinal.<br><br>
A nivel parroquia el patrón se suaviza: sobre las <strong>825 parroquias con al menos un incendio</strong>, la <strong>correlación de Spearman</strong> entre %MVMC y hectáreas quemadas es de <strong>ρ ≈ 0,09</strong> (0,15 con la superficie en escala logarítmica). Spearman mide si dos variables se mueven juntas en orden. El 0 significa sin relación, +1 una relación creciente perfecta y −1 decreciente perfecta. <strong>0,09 es muy débil</strong>: la propiedad colectiva por sí sola no explica el fuego, importa dónde está esa propiedad. La cola de fuegos grandes sí cambia: <strong>media de 272 ha</strong> en parroquias con ≥20% de MVMC frente a <strong>62 ha</strong> en el resto.<br><br>
La explicación tiene poco que ver con el régimen jurídico en sí: las comunidades de montes han sido históricamente uno de los pocos agentes que aún hacen gestión activa del monte. La correlación habla, sobre todo, de <strong>dónde queda el monte</strong>: en las parroquias rurales del interior orensano, vaciadas por el éxodo, donde la propiedad colectiva sobrevive porque el minifundio privado se abandonó. La estimación de hectáreas sobre MVMC es proporcional al peso de MVMC en cada parroquia, una aproximación honesta a falta de los perímetros oficiales.
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
                                Fuente: Comparador del Plan Nacional de Ortofotografía Aérea
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
                <div class="calor-texto-libre">
                        <p style="margin: 0 0 14px 0; font-size: 16px; line-height: 1.8;">
                            Todo esto ocurre en un contexto de cambio climático que aumenta el riesgo y extiende la temporada de incendios. En este gráfico podemos ver cómo han cambiado las temperaturas en Galicia desde los años 40.<br><br>
                            A medida que avanza la serie temporal, los meses fríos van perdiendo el tono azul que representa las temperaturas bajas. Ese color, tan presente en las primeras décadas, se atenúa poco a poco hasta casi pasar a blanco en los últimos años. Paralelamente, los veranos se vuelven más cálidos y prolongados, ocupando el rojo cada vez más espacio en el mapa de color.
                        </p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                            Los estudios sobre olas de calor muestran que estos fenómenos extremos no solo aumentan en frecuencia, sino también en intensidad y duración. Prácticas que antes eran relativamente seguras, como las <strong>quemas agrícolas y ganaderas</strong>, se convierten en riesgo elevado cuando coinciden con períodos de alta temperatura, baja humedad y vientos intensos.
                        </p>

                        <div id="heatmap-temp-host" class="grafica-host"></div>
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
                { callbackName: 'renderHeatmapTemp' }
            ],
            onChapterExit: []
        }
    ]
};
