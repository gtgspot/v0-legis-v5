"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DataLexPage() {
  // This effect will inject the DataLex HTML content into the iframe
  useEffect(() => {
    const iframe = document.getElementById("datalex-iframe") as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      const dataLexHTML = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>DataLex: Application Development Tools</title>
	<script type="text/javascript" src="https://datalex.org/tools/ajax1.js"></script>
	<script type="text/javascript" src="https://datalex.org/tools/form.js"></script>

	<link href="https://datalex.org/tools/import_rule.css" rel="stylesheet" type="text/css">
	<link href="https://datalex.org/tools/datalex_tools.css" rel="stylesheet" type="text/css">
  
  <style>
    /* Additional styling for better integration */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      color: #333;
    }
    
    .datalex-import {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .button-section button, 
    .button-section input[type="submit"],
    .right-button-section button {
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 16px;
      margin-right: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .button-section button:hover, 
    .button-section input[type="submit"]:hover,
    .right-button-section button:hover {
      background-color: #e9ecef;
      border-color: #ced4da;
    }
    
    #datalex-run-consultation-button {
      background-color: #4f46e5;
      color: white;
      border-color: #4338ca;
    }
    
    #datalex-run-consultation-button:hover {
      background-color: #4338ca;
    }
    
    #datalex-import-rule {
      min-height: 300px;
      font-family: monospace;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .result-container {
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f8f9fa;
    }
    
    .loading-indicator {
      display: none;
      text-align: center;
      padding: 20px;
    }
    
    .loading-indicator.active {
      display: block;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>

<body>

<div class="datalex-import">
  <h1>DataLex Application Development Tools<span>Tools for DataLex application development and training</span></h1>
  <div class="disclaimer">
    <p><b>Note:</b> Applications created using the DataLex software may only be used for educational and testing purposes.  They may not be used for any other purposes, whether commercial or non-commercial.</p>
    <p>Details of AustLII's DataLex project, including instructional materials on use of the software, are at <a href="http://austlii.community/wiki/DataLex/" target="_blank">http://austlii.community/wiki/DataLex/</a>.</p>

    <p>Comments on the DataLex software and these development tools are welcome, and should be sent to <a href="mailto:datalex@austlii.edu.au">datalex@austlii.edu.au</a>. We are very interested to see test applications developed using the software.</p>
  </div>

  <form action="https://datalex.org/cgi-bin/datalex_import.cgi" id="datalex-import-form">
    <div class="section"><span class="circle">I</span>Import legislative section (available on <a href="http://www.austlii.edu.au/" target="_blank">AustLII</a>)</div>
    <div class="inner-wrap">
        <label>Act Name (incl Short title and Year eg <em>Freedom of Information Act 1982</em>)<input type="text" name="act_name" list="acts"></label>
	<datalist id="acts">
	  <option value="Australia's Foreign Relations (State and Territory Arrangements) Act 2020">
	  <option value="Crimes Act 1900">
	  <option value="Copyright Act 1967">
	  <option value="Electoral Act 1980">
	</datalist>
	<label>Jurisdiction<select name="juris">
		  <option value="">Select a jurisdiction</option>
                 <optgroup label="Australian Legislation">
                  <option value="cth">Commonwealth</option>
                  <option value="act">Australian Capital Territory</option>
                  <option value="nsw">New South Wales</option>
                  <option value="nt">Northern Territory</option>
                  <option value="qld">Queensland</option>
                  <option value="sa">South Australia</option>
                  <option value="tas">Tasmania</option>
                  <option value="vic">Victoria</option>
                  <option value="wa">Western Australia</option>
                </optgroup>
                <optgroup label="British and Irish Legislation">
                  <option value="ie">Ireland</option>
                  <option value="nie">Northern Ireland</option>
                  <option value="scot">Scotland</option>
                  <option value="wales">Wales</option>
                  </optgroup>
		</select> </label>
        <label>Section Number<input type="text" name="sec_num"></label>

        <input type="submit" name="submit" value="Import & Replace" id="datalex-import-replace-button" formaction="https://datalex.org/cgi-bin/datalex_import.cgi">
        <input type="submit" name="submit" value="Import & Append" id="datalex-import-append-button" formaction="https://datalex.org/cgi-bin/datalex_import.cgi">
        <span class="checkbox"><input type="checkbox" name="extract_links" value="on" id="extract_links" title="Selecting this will extract links contained in the section being export. Deselect if ylegis will be used." > Extract Links</span>
        <input type="hidden" name="ylegis" value="1">
    </div>
    <div id="import-result" class="result-container" style="display: none;"></div>
    <div id="import-loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Processing your request...</p>
    </div>
  </form>

  <form action="https://datalex.org/cgi-bin/ylegis_preprocessor.cgi" id="datalex-dev-form" method="POST" target="_blank">
    <div class="section"><span class="circle">E</span>Edit DataLex application</div>
    <div class="inner-wrap">
        <label>Application<textarea id="datalex-import-rule" name="rulepaste" ></textarea></label>
        <div id="syntax-messages"><p id="datalex-check-syntax" name="checksyntax"></p></div>

        <div class="button-section">
          <input type="submit" name="run_consultation" value="Run Consultation" id="datalex-run-consultation-button" formaction="https://datalex.org/app/">
          <button type="button" name="check_fact_cross_references" value="Check Fact Cross References" id="check-fact-cross-references-button" formaction="https://datalex.org/cgi-bin/dc.cgi?options=crossref&format=html" title="Shows which rules use the fact and which rules are capable of concluding a value for the fact">Check Fact Cross References</button>
          <button type="button" name="check_fact_translations" value="Check Fact Translations" id="check-fact-translations-button" formaction="https://datalex.org/cgi-bin/dc.cgi?options=facts&format=html" title="Shows translations used for all facts and includes the prompt that will be used to get a value from the user and the fact in positive and negative form">Check Fact Translations</button>
          <button type="button" name="check_syntax" value="Check Syntax" id="datalex-check-syntax-button" formaction="https://datalex.org/cgi-bin/cs.cgi" title="Check syntax for issues of yscript rules">Check Syntax</button>
          <button type="button" name="ylegis_preprocessor" value="ylegis Preprocessor" id="datalex-ylegis-preprocessor-button" formaction="https://datalex.org/cgi-bin/ylegis_preprocessor.cgi" title="Filters legislation and produces 'rough cut' yscript style rules that reflect the legislation's structure">ylegis Preprocessor</button>
        </div>
    </div>
    <div id="dev-result" class="result-container" style="display: none;"></div>
    <div id="dev-loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Processing your request...</p>
    </div>
  </form>

  <div class="right-button-section">
     <button type="button" value="Clear Application" id="clear-application-button" onClick="clear_textarea('datalex-import-rule');clear_div('datalex-check-syntax')">Clear Application</button>
     <button type="button" value="Clear All" id="clear-all-button" onClick="window.location.href=window.location.href">Clear All</button>
  </div>

</div> <!-- datalex-import -->

<script type="text/javascript">
/*
    AJAX Form in Pure JavaScript, without jQuery.
    Written by Qassim Hassan.
    http://wp-time.com/ajax-form-pure-javascript-without-jquery/
*/

/* AJAX Form Function */
function Normalform(formID, buttonID, resultID, loadingID, formMethod = 'post', actionType = 'replace') {
    var selectForm = document.getElementById(formID); // Select the form by ID.
    var selectButton = document.getElementById(buttonID); // Select the button by ID.
    var selectResult = document.getElementById(resultID); // Select result element by ID.
    var selectLoading = document.getElementById(loadingID); // Select loading element by ID.
    var formAction = document.getElementById(buttonID).getAttribute('formaction'); // Get the form action.
    var formInputs = document.getElementById(formID).querySelectorAll("input"); // Get the form inputs.
    var formSelects = document.getElementById(formID).querySelectorAll("select"); // Get the form inputs.
    var formTextAreas = document.getElementById(formID).querySelectorAll("textarea"); // Get the form inputs.

    function FormSubmit() {
        // Show loading indicator
        if (selectLoading) {
            selectLoading.style.display = "block";
        }
        
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        
        // Configure it: POST-request for the URL
        xhr.open(formMethod, formAction, true);
        
        // Set the proper header for form data
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Hide loading indicator
                if (selectLoading) {
                    selectLoading.style.display = "none";
                }
                
                // Show result container
                if (selectResult) {
                    selectResult.style.display = "block";
                    
                    if (actionType === 'replace') {
                        selectResult.innerHTML = xhr.responseText;
                    } else if (actionType === 'append') {
                        selectResult.innerHTML += xhr.responseText;
                    }
                }
            } else {
                // Hide loading indicator
                if (selectLoading) {
                    selectLoading.style.display = "none";
                }
                
                // Show error message
                if (selectResult) {
                    selectResult.style.display = "block";
                    selectResult.innerHTML = "Error: " + xhr.status + " " + xhr.statusText;
                }
            }
        };
        
        // Handle network errors
        xhr.onerror = function() {
            // Hide loading indicator
            if (selectLoading) {
                selectLoading.style.display = "none";
            }
            
            // Show error message
            if (selectResult) {
                selectResult.style.display = "block";
                selectResult.innerHTML = "Network Error: Could not connect to the server.";
            }
        };
        
        // Collect form data
        var formData = new FormData(selectForm);
        var urlEncodedData = "";
        var urlEncodedDataPairs = [];
        
        // Turn the data object into an array of URL-encoded key/value pairs
        for(var pair of formData.entries()) {
            urlEncodedDataPairs.push(encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]));
        }
        
        // Combine the pairs into a single string and replace all %-encoded spaces with '+'
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
        
        // Send the data
        xhr.send(urlEncodedData);
    }

    selectButton.onclick = function(e) { // If clicked on the button.
        e.preventDefault(); // Prevent default form submission
        FormSubmit();
    }
}

/* Button Form Function */
function Buttonform(formID, buttonID, resultID, loadingID, formMethod = 'post', actionType = 'replace') {
    var selectForm = document.getElementById(formID); // Select the form by ID.
    var selectButton = document.getElementById(buttonID); // Select the button by ID.
    var selectResult = document.getElementById(resultID); // Select result element by ID.
    var selectLoading = document.getElementById(loadingID); // Select loading element by ID.
    var formAction = document.getElementById(buttonID).getAttribute('formaction'); // Get the form action.
    var formInputs = document.getElementById(formID).querySelectorAll("input"); // Get the form inputs.
    var formSelects = document.getElementById(formID).querySelectorAll("select"); // Get the form inputs.
    var formTextAreas = document.getElementById(formID).querySelectorAll("textarea"); // Get the form inputs.

    function FormSubmit() {
        // Show loading indicator
        if (selectLoading) {
            selectLoading.style.display = "block";
        }
        
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        
        // Configure it: POST-request for the URL
        xhr.open(formMethod, formAction, true);
        
        // Set the proper header for form data
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Hide loading indicator
                if (selectLoading) {
                    selectLoading.style.display = "none";
                }
                
                // Show result container
                if (selectResult) {
                    selectResult.style.display = "block";
                    
                    if (actionType === 'replace') {
                        selectResult.innerHTML = xhr.responseText;
                    } else if (actionType === 'append') {
                        selectResult.innerHTML += xhr.responseText;
                    }
                }
            } else {
                // Hide loading indicator
                if (selectLoading) {
                    selectLoading.style.display = "none";
                }
                
                // Show error message
                if (selectResult) {
                    selectResult.style.display = "block";
                    selectResult.innerHTML = "Error: " + xhr.status + " " + xhr.statusText;
                }
            }
        };
        
        // Handle network errors
        xhr.onerror = function() {
            // Hide loading indicator
            if (selectLoading) {
                selectLoading.style.display = "none";
            }
            
            // Show error message
            if (selectResult) {
                selectResult.style.display = "block";
                selectResult.innerHTML = "Network Error: Could not connect to the server.";
            }
        };
        
        // Collect form data
        var formData = new FormData(selectForm);
        var urlEncodedData = "";
        var urlEncodedDataPairs = [];
        
        // Turn the data object into an array of URL-encoded key/value pairs
        for(var pair of formData.entries()) {
            urlEncodedDataPairs.push(encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]));
        }
        
        // Combine the pairs into a single string and replace all %-encoded spaces with '+'
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
        
        // Send the data
        xhr.send(urlEncodedData);
    }

    selectButton.onclick = function(e) { // If clicked on the button.
        e.preventDefault(); // Prevent default form submission
        FormSubmit();
    }
}

// Helper functions
function clear_textarea(id) {
    var textarea = document.getElementById(id);
    if (textarea) {
        textarea.value = '';
    }
}

function clear_div(id) {
    var div = document.getElementById(id);
    if (div) {
        div.innerHTML = '';
    }
}

// Initialize AJAX forms when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Import & Replace button
    Normalform('datalex-import-form', 'datalex-import-replace-button', 'import-result', 'import-loading', 'post', 'replace');
    
    // Initialize Import & Append button
    Normalform('datalex-import-form', 'datalex-import-append-button', 'import-result', 'import-loading', 'post', 'append');
    
    // Initialize Check Fact Cross References button
    Buttonform('datalex-dev-form', 'check-fact-cross-references-button', 'dev-result', 'dev-loading', 'post', 'replace');
    
    // Initialize Check Fact Translations button
    Buttonform('datalex-dev-form', 'check-fact-translations-button', 'dev-result', 'dev-loading', 'post', 'replace');
    
    // Initialize Check Syntax button
    Buttonform('datalex-dev-form', 'datalex-check-syntax-button', 'dev-result', 'dev-loading', 'post', 'replace');
    
    // Initialize ylegis Preprocessor button
    Buttonform('datalex-dev-form', 'datalex-ylegis-preprocessor-button', 'dev-result', 'dev-loading', 'post', 'replace');
});
</script>

<script type="text/javascript" src="https://datalex.org/tools/datalex_tools.js"></script>
</body></html>`

      iframe.contentWindow.document.open()
      iframe.contentWindow.document.write(dataLexHTML)
      iframe.contentWindow.document.close()
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">DataLex Application Development Tools</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-800">About DataLex</h2>
          <p className="text-gray-600 mt-1">
            DataLex is AustLII's platform for developing rule-based legal applications. Use these tools to import
            legislative sections from AustLII and create rule-based applications.
          </p>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              onClick={() => window.open("http://austlii.community/wiki/DataLex/", "_blank")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Documentation
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("mailto:datalex@austlii.edu.au", "_blank")}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Contact DataLex Team
            </Button>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <p>
              <strong>Note:</strong> Applications created using the DataLex software may only be used for educational
              and testing purposes. They may not be used for any other purposes, whether commercial or non-commercial.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <iframe
          id="datalex-iframe"
          className="w-full min-h-screen border-0"
          title="DataLex Application Development Tools"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        ></iframe>
      </div>
    </div>
  )
}
