'use strict';

(function() {
	// Gafxmls Controller Spec
	describe('Gafxmls Controller Tests', function() {
		// Initialize global variables
		var GafxmlsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gafxmls controller.
			GafxmlsController = $controller('GafxmlsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gafxml object fetched from XHR', inject(function(Gafxmls) {
			// Create sample Gafxml using the Gafxmls service
			var sampleGafxml = new Gafxmls({
				name: 'New Gafxml'
			});

			// Create a sample Gafxmls array that includes the new Gafxml
			var sampleGafxmls = [sampleGafxml];

			// Set GET response
			$httpBackend.expectGET('gafxmls').respond(sampleGafxmls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gafxmls).toEqualData(sampleGafxmls);
		}));

		it('$scope.findOne() should create an array with one Gafxml object fetched from XHR using a gafxmlId URL parameter', inject(function(Gafxmls) {
			// Define a sample Gafxml object
			var sampleGafxml = new Gafxmls({
				name: 'New Gafxml'
			});

			// Set the URL parameter
			$stateParams.gafxmlId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gafxmls\/([0-9a-fA-F]{24})$/).respond(sampleGafxml);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gafxml).toEqualData(sampleGafxml);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gafxmls) {
			// Create a sample Gafxml object
			var sampleGafxmlPostData = new Gafxmls({
				name: 'New Gafxml'
			});

			// Create a sample Gafxml response
			var sampleGafxmlResponse = new Gafxmls({
				_id: '525cf20451979dea2c000001',
				name: 'New Gafxml'
			});

			// Fixture mock form input values
			scope.name = 'New Gafxml';

			// Set POST response
			$httpBackend.expectPOST('gafxmls', sampleGafxmlPostData).respond(sampleGafxmlResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gafxml was created
			expect($location.path()).toBe('/gafxmls/' + sampleGafxmlResponse._id);
		}));

		it('$scope.update() should update a valid Gafxml', inject(function(Gafxmls) {
			// Define a sample Gafxml put data
			var sampleGafxmlPutData = new Gafxmls({
				_id: '525cf20451979dea2c000001',
				name: 'New Gafxml'
			});

			// Mock Gafxml in scope
			scope.gafxml = sampleGafxmlPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gafxmls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gafxmls/' + sampleGafxmlPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gafxmlId and remove the Gafxml from the scope', inject(function(Gafxmls) {
			// Create new Gafxml object
			var sampleGafxml = new Gafxmls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gafxmls array and include the Gafxml
			scope.gafxmls = [sampleGafxml];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gafxmls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGafxml);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gafxmls.length).toBe(0);
		}));
	});
}());