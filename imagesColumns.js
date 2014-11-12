/**
 * Created by MReal on 11/1/14.
 */


(function() {
	angular
		.module('imagesColumns', [])
		.service('columnsService', columnsService)
		.directive('loadImg', loadImgDirective);

	function columnsService($timeout) {
		var service = {
			objects: [],
			interval: 0,
			columnsCount: 3,
			columns: [],
			init: init,
			initColumns: initColumns,
			addObjects: addObjects,
			pushNextObject: pushNextObject,
			getLowestColumn: getLowestColumn,
			updateColumn: updateColumn
		};
		return service;

		function init(objects) {
			service.objects = service.objects.concat(objects);
			service.initColumns();
			service.pushNextObject();
		}

		function addObjects(objects) {
			service.objects = service.objects.concat(objects);
			service.pushNextObject();
		}

		function initColumns() {
			for (var i = 0; i < service.columnsCount; i++) {
				service.columns[i] = {
					height: 0,
					objects: []
				};
			}
		}

		function pushNextObject() {
			$timeout(function(){
				var object = service.objects.shift();
				if (angular.isDefined(object)) {
					var column = service.getLowestColumn();
					column.objects.push(object);
				}
			}, service.interval);
		}

		function getLowestColumn() {
			var minIndex = null;
			var minHeight = null;
			angular.forEach(service.columns, function(column, index) {
				if (minIndex === null || column.height < minHeight) {
					minIndex = index;
					minHeight = column.height;
				}
			});
			return service.columns[minIndex];
		}

		function updateColumn(index, height) {
			service.columns[index].height += height;
		}
	}

	function loadImgDirective(columnsService) {
		var directive = {
			restrict: 'A',
			link: link
		};
		return directive;

		function link($scope, element, attrs) {
			element.on('load', function(event) {
				$scope.$apply(function() {
					columnsService.updateColumn($scope.$parent.$index, element[0].offsetHeight);
					columnsService.pushNextObject();
				});
			});
		}
	}
})();
