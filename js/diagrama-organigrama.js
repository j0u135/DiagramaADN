//Variable aplicación AngularJs
var appADN = angular.module('appADN', ['BasicPrimitives']);
/*Variable Global para cada uno de los Items*/

var items = {};

//Inicia controlador AngularJs
appADN.controller('controllerADN', ['$scope', function ($scope) {
	
	$scope.items_identificadores  = [];
	$scope.items_identificadores.push({
		id: 0,
		parent: null,
		title: "Indicador Inicial",
		description: "Puesto Inicial",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue
	});
	$scope.items_identificadores.push({
		id: 1,
		parent: 1,
		title: "Indicador 1",
		description: "Indicador 1",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue	
	});
	$scope.items_identificadores.push({
		id: 2,
		parent: 1,
		title: "Indicador 2",
		description: "Indicador 2",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue	
	});
	$scope.items_identificadores.push({
		id: 3,
		parent: 1,
		title: "Indicador 3",
		description: "Indicador 3",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue	
	});
	$scope.items_identificadores.push({
		id: 4,
		parent: 1,
		title: "Indicador 4",
		description: "Indicador 4",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue	
	});
	$scope.items_identificadores.push({
		id: 5,
		parent: 1,
		title: "Indicador 5",
		description: "Indicador 5",
		asociados: [],
		itemTitleColor: primitives.common.Colors.RoyalBlue	
	});

	$scope.puesto_seleccionado = "";

	$scope.index = 1; //Inicia el indice en 1 pues solo muestra el inicial, debe ser dinámico cuando se cargue de la base de datos

	var options = new primitives.orgdiagram.Config();
	$scope.cursor_asociar = "";

	$scope.bandera_asociar = false;
	$scope.bandera_editar = false;

	/*Llenado de los Items en Duro*/
	items = [
		new primitives.orgdiagram.ItemConfig({
			id: 0,
			parent: null,
			title: "Puesto Inicial",
			description: "Puesto Inicial",
			asociados: [],
			itemTitleColor: primitives.common.Colors.RoyalBlue,
		})
	];

	//Se agregan los botones para la edición
	var buttons = [];
	var button_agregar = new primitives.orgdiagram.ButtonConfig();
	button_agregar.name = "agregar";
	button_agregar.icon = "ui-icon-plus";
	button_agregar.tooltip = "Agregar"
	button_agregar.size = new primitives.common.Size(11, 11);
	buttons.push(button_agregar);

	var button_asociar = new primitives.orgdiagram.ButtonConfig();
	button_asociar.name = "asociar";
	button_asociar.icon = "ui-icon-flag";
	button_asociar.tooltip = "Asociar"
	button_asociar.size = new primitives.common.Size(11, 11);
	buttons.push(button_asociar);

	var button_editar = new primitives.orgdiagram.ButtonConfig();
	button_editar.name = "editar";
	button_editar.icon = "ui-icon-pencil";
	button_editar.tooltip = "Editar"
	button_editar.size = new primitives.common.Size(11, 11);
	buttons.push(button_editar);

	//Se llenan las opciones del chart
	options.items = items;
	options.cursorItem = 0;
	options.highlightItem = 0;
	options.hasSelectorCheckbox = primitives.common.Enabled.False;//Sin seleccion
	options.templates = [getContactTemplate()];
	options.defaultTemplateName = "contactTemplate";
	options.buttons = buttons;
	options.hasButtons = primitives.common.Enabled.True;
	options.onButtonClick = function(e, data){
		switch (data.name) {
			case "asociar":
				$scope.bandera_editar = false;
				if ($scope.bandera_asociar == false) {
					$scope.cursor_asociar = data.context.id;
					options.cursorItem = data.context.id;
					$scope.bandera_asociar = true;
				}
			break;
			case "editar":
				$scope.cursor_asociar = "";
				$scope.bandera_asociar = false;
				options.cursorItem = data.context.id;
				$scope.bandera_editar = true;
			break;
			case "agregar":
				$scope.cursor_asociar = "";
				$scope.bandera_editar = false;
				$scope.bandera_asociar = false;
				$scope.addItem($scope.index + 1, data.context.id);
			break;
		}
		$scope.$apply();
	};//Función para botones laterales
	options.enablePanning = false;//Deshabilitar panning para no interferir con Drag and Drop
	options.onCursorChanged = function(e, data){
		cursor_asociar = "";
		$scope.bandera_editar = false;
		$scope.bandera_asociar = false;
		$scope.$apply();
	}

	//Se agrega la opcion pahacer el drop
	jQuery("#orgdiagram").droppable({
		greedy: true,
		drop: function (event, ui) {
			if (!event.cancelBubble) {
				toValue = null;
				toChart = name;
				Reparent(fromChart, fromValue, toChart, toValue);
				primitives.common.stopPropagation(event);
			}
		}
	});

//Función al cargar la página para crear el elemento color picker
$(document).ready(function(){
	var $box = $('#colorPicker1');
	$box.tinycolorpicker();
	var box = $box.data("plugin_tinycolorpicker")
	//Al cambiar el color del campo escondido actualizamos el color del elemento seleccionado y aplicamos la dependencia(angular)
	$box.bind("change", function(){
		var item = items[$scope.myOptions.cursorItem]
		item.itemTitleColor = $('#colorescondido').val();
		$scope.$apply();
	});
});

	Array.prototype.contains = function ( needle ) {
		for (i in this) {
			if (this[i] == needle) return true;
		}
		return false;
	}

	//Se publican las opciones
	$scope.myOptions = options;

	$scope.asociar_identificador = function (items, cursor_asociar, asociado){
		if(cursor_asociar != asociado.id){
			var item_receptor = items[cursor_asociar];
			if(!item_receptor.asociados.contains(asociado.id)){
				item_receptor.asociados[item_receptor.asociados.length] = asociado.id;
			}
		}
	}


	$scope.eliminarAsociado = function(item_id, id_eliminar){
		$scope.myOptions.items[item_id].asociados.splice(id_eliminar, 1);
	}
	
	$scope.setCursorItem = function (item) {
		$scope.myOptions.cursorItem = item;
		//cursor_asociar = "";
		$scope.bandera_editar = false;
		//$scope.bandera_asociar = false;
	};

	//Función para decidir que se muestra en el panel izquierdo
	$scope.mostrarItem = function (item) {
		if (item.id == $scope.myOptions.cursorItem){
			return true;
		}else{
			return false;
		}					
	}


	$scope.asociar = function(){
		$scope.cursor_asociar = $scope.myOptions.cursorItem;
		$scope.bandera_asociar = true;
	}

	$scope.salir_asociar = function(item){
		$scope.bandera_asociar = false;
		$scope.myOptions.cursorItem = item;
		$scope.cursor_asociar = "";
	}


	//No se usa 
	$scope.setHighlightItem = function (item) {
		$scope.myOptions.highlightItem = item;
	};

	//función angular para borrar elemento
	$scope.deleteItem = function (index) {
		if (items[index].parent != null) {
			$scope.myOptions.items.splice(index, 1);
		}
		else{
			alert("No se puede eliminar el elemento raíz.");
		}
	}

	//función angular para crear nuevo elemento
	$scope.addItem = function (index, parent) {
		var id = $scope.index++;
		var item = items[parent];
		var color = item.itemTitleColor;
		//$scope.myOptions.items.splice(index, 0, new primitives.orgdiagram.ItemConfig({
		//Se cambia el indice al agregar un item, del indice del padre +1 (index) por la longitud +1 (id)
		$scope.myOptions.items.splice(id, 0, new primitives.orgdiagram.ItemConfig({
			id: id,
			parent: parent,
			title: "Nuevo Puesto " + id,
			description: "Descripción " + id,
			asociados: [],
			itemTitleColor: color,
		}));
	}

	//Función para la creació de la vista del template
	function getContactTemplate() {
		var result = new primitives.orgdiagram.TemplateConfig();
		result.name = "contactTemplate";
		result.itemSize = new primitives.common.Size(180, 62);
		result.minimizedItemSize = new primitives.common.Size(5, 5);
		result.minimizedItemCornerRadius = 5;
		result.highlightPadding = new primitives.common.Thickness(2, 2, 2, 2);
		var itemTemplate = jQuery(
			'<div class="bp-item bp-corner-all bt-item-frame">'
				+ '<div name="titleBackground" class="bp-item bp-corner-all bp-title-frame" style="background:{{itemConfig.itemTitleColor}};top: 2px; left: 2px; width: 175px; height: 58px;">'
					+ '<div name="title" class="bp-item bp-title" style="top: 4px; left: 6px; width: 180px; height: 25px;">{{itemConfig.title}}</div>'
				+ '</div>'
				+ '<div class="bp-item bp-corner-all" style="color: #000 ;background: #fff; top: 3px; right: 4px; width: 25px; height: 23px; font-size: 13px">'
					+ '<div style="padding: 3px 0px 0px 5px;">{{itemConfig.title.substring(0,1)}}{{itemConfig.id}}</div>'
				+ '</div>'
			+ '</div>'

		).css({
			width: result.itemSize.width + "px",
			height: result.itemSize.height + "px"
		}).addClass("bp-item bp-corner-all bt-item-frame");
		result.itemTemplate = itemTemplate.wrap('<div>').parent().html();
		return result;
	}

}]);//Fin del controlador

angular.module('BasicPrimitives', [], function ($compileProvider) {
			
	$compileProvider.directive('bpOrgDiagram', function ($compile) {

		function link(scope, element, attrs) {
			var itemScopes = [];
			var config = new primitives.orgdiagram.Config();

			angular.extend(config, scope.options);


			config.onItemRender = onTemplateRender;
			//config.onCursorChanged = onCursorChanged;
			config.onHighlightChanged = onHighlightChanged;

			config.pageFitMode = primitives.common.PageFitMode.PageWidth;

			var chart = jQuery(element).orgDiagram(config);

			scope.$watch('options.highlightItem', function (newValue, oldValue) {
				var highlightItem = chart.orgDiagram("option", "highlightItem");
				if (highlightItem != newValue) {
					chart.orgDiagram("option", { highlightItem: newValue });
					chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.PositonHighlight);
				}
			});

			scope.$watch('options.cursorItem', function (newValue, oldValue) {
				var cursorItem = chart.orgDiagram("option", "cursorItem");
				if (cursorItem != newValue) {
					chart.orgDiagram("option", { cursorItem: newValue });
					chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
				}
			});


			scope.$watchCollection('options.items', function (items) {
				chart.orgDiagram("option", { items: items });
				chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
			});

			//Función para el render de cada item
			function onTemplateRender(event, data) {
				var itemConfig = data.context;
				switch (data.renderingMode) {
					case primitives.common.RenderingMode.Create://Modo Nuevo Item
						var itemScope = scope.$new();
						itemScope.itemConfig = itemConfig;
						itemScope.items_l = scope.options.items;
						itemScope.cursorItem_l = scope.options.cursorItem;
						$compile(data.element.contents())(itemScope);
						if (!scope.$parent.$$phase) {
								itemScope.$apply();
						}
						data.element.draggable({//Propiedades del drag del nuevo elemento
							revert: "invalid",
							containment: "document",
							appendTo: "body",
							helper: "clone",
							cursor: "move",
							"zIndex": 10000,
							delay: 300,
							distance: 10,
							start: function (event, ui) {
								fromValue = parseInt(jQuery(this).attr("data-value"), 10);
								fromChart = "orgdiagram";
							}
						});
						data.element.droppable({//Propiedades del drop del nuevo elemento
							greedy: true,
							drop: function (event, ui) {
								if (!event.cancelBubble) {
									console.log("Drop accepted!");
									toValue = parseInt(jQuery(this).attr("data-value"), 10);
									toChart = "orgdiagram";
									Reparent(fromChart, fromValue, toChart, toValue);
									primitives.common.stopPropagation(event);
								} else {
									  console.log("Drop ignored!");
								}
							},
							over: function (event, ui) {
								toValue = parseInt(jQuery(this).attr("data-value"), 10);
								toChart = "orgdiagram";
								jQuery("#orgdiagram").orgDiagram({ "highlightItem": toValue });
								jQuery("#orgdiagram").orgDiagram("update", primitives.common.UpdateMode.PositonHighlight);
							},
							accept: function (draggable) {
	
								return (jQuery(this).css("visibility") == "visible");
							}
						});
						itemScopes.push(itemScope);
					break;
					case primitives.common.RenderingMode.Update:
						/* Update widgets here */
						var itemScope = data.element.contents().scope();
						itemScope.itemConfig = itemConfig;
						itemScope.items_l = scope.options.items;
						itemScope.cursorItem_l = scope.options.cursorItem;
					break;
				}
				var itemConfig = data.context;

				data.element.attr("data-value", itemConfig.id);
				//RenderField(data, itemConfig);//Ya no es necesario

			}//Fin de la función para el render de cada item


			//Función para recolocar el elemento movido con su padre
			function Reparent(fromChart, value, toChart, toParent) {
				/* following verification needed in order to avoid conflict with jQuery Layout widget */

				for (var index = 0; index < items.length; index++) {
					var child = items[index];
				}

				if (fromChart != null && value != null && toChart != null) {
					console.log("Reparent fromChart:" + fromChart + ", value:" + value + ", toChart:" + toChart + ", toParent:" + toParent);
					var item = items[value];
					var fromItems = jQuery("#" + fromChart).orgDiagram("option", "items");
					var toItems = jQuery("#" + toChart).orgDiagram("option", "items");
					if (toParent != null) {
						var toParentItem = items[toParent];
						if (!isParentOf(item, toParentItem)) {

							var children = getChildrenForParent(item);
							children.push(item);
							for (var index = 0; index < children.length; index++) {
								var child = children[index];
								fromItems.splice(primitives.common.indexOf(fromItems, child), 1);
								toItems.push(child);
							}
							item.parent = toParent;
						} else {
							console.log("Droped to own child!");
						}
					} else {
						var children = getChildrenForParent(item);
						children.push(item);
						for (var index = 0; index < children.length; index++) {
							var child = children[index];
							fromItems.splice(primitives.common.indexOf(fromItems, child), 1);
							toItems.push(child);
						}
						item.parent = null;
					}
				}
				chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Recreate);
				scope.$apply();
			}
			//Fin de la función para recolocar el elemento movido con su padre

			//Función para obtener los hijos del elemento movido
			function getChildrenForParent(parentItem) {
				var children = {};
				for (var id in items) {
					var item = items[id];
					if (children[item.parent] == null) {
						children[item.parent] = [];
					}
					children[item.parent].push(id);
				}
				var newChildren = children[parentItem.id];
				var result = [];
				if (newChildren != null) {
					while (newChildren.length > 0) {
						var tempChildren = [];
						for (var index = 0; index < newChildren.length; index++) {
							var item = items[newChildren[index]];
							result.push(item);
							if (children[item.id] != null) {
								tempChildren = tempChildren.concat(children[item.id]);
							}
						}
						newChildren = tempChildren;
					}
				}
				return result;
			}//Fin de la función para obtener los hijos del elemento movido

			function isParentOf(parentItem, childItem) {
				var result = false,
					index,
					len,
					itemConfig;
				if (parentItem.id == childItem.id) {
					result = true;
				} else {
					while (childItem.parent != null) {

						childItem = items[childItem.parent];
						if (childItem.id == parentItem.id) {
							result = true;
							break;
						  }
					 }
				}
				return result;
			};


			function ResizePlaceholder() {
				var panel = jQuery("#centerpanel");
				var panelSize = new primitives.common.Rect(0, 0, panel.innerWidth(), panel.innerHeight());
				var position = new primitives.common.Rect(0, 0, panelSize.width / 2, panelSize.height);
				position.offset(-2);
				var position2 = new primitives.common.Rect(panelSize.width / 2, 0, panelSize.width / 2, panelSize.height);
				position2.offset(-2);

				jQuery("#orgdiagram").css(position.getCSS());
			}

			function onButtonClick(e, data) {
				scope.onButtonClick();
				scope.$apply();
			}

			function onCursorChanged(e, data) {
				scope.options.cursorItem = data.context ? data.context.id : null;
				scope.onCursorChanged();
				scope.$apply();
			}

			function onHighlightChanged(e, data) {
				scope.options.highlightItem = data.context ? data.context.id : null;
				scope.onHighlightChanged();
				scope.$apply();
			}

			element.on('$destroy', function () {
				/* destroy items scopes */
				for (var index = 0; index < scopes.length; index++) {
					 itemScopes[index].$destroy();
				}

				/* destory jQuery UI widget instance */
				chart.remove();
			});
		};
	return {
		scope: {
			options: '=options',
			onCursorChanged: '&onCursorChanged',
			onHighlightChanged: '&onHighlightChanged',
		},
		link: link
			};
		});
	});