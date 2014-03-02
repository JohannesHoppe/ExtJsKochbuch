﻿Product          : Ext.NET.Pro
Release Date     : 2013-12-03
Current Version  : 2.4.0
Previous Version : 2.3.1


--------------------------------------------------------------------------
CONTENTS
--------------------------------------------------------------------------

I.   SYSTEM REQUIREMENTS
II.  INSTALLATION INSTRUCTIONS
III. REVISIONS + BREAKING CHANGES
IV.  SAMPLE WEB.CONFIG
V.   <extnet> WEB.CONFIG GLOBAL CONFIGURATION PROPERTIES
VI.  CREDITS


--------------------------------------------------------------------------
I. SYSTEM REQUIREMENTS
--------------------------------------------------------------------------

1. Visual Studio 2008, 2010, 2012 or 2013, or
2. Visual Studio Express 2008, 2010, 2012 or 2013
3. .NET Framework 3.5, 4.0* or 4.5

*minimum required for Ext.NET MVC

	
--------------------------------------------------------------------------
II. INSTALLATION INSTRUCTIONS
--------------------------------------------------------------------------

Getting Started (NuGet)

The easiest and quickest way to install Ext.NET is using NuGet. Run the 
following command in Visual Studio Command panel, or seach for "Ext.NET" 
in NuGet Package Manager.

    Install-Package Ext.NET


Getting Started (Manual Installation with Videos)

http://forums.ext.net/showthread.php?11027-Install-and-Setup-Guide-for-Visual-Studio


--------------------------------------------------------------------------
III. REVISIONS + BREAKING CHANGES
--------------------------------------------------------------------------

See CHANGELOG.txt and BREAKING_CHANGES.txt files included in the download package, or view online:

http://examples.ext.net/#/Getting_Started/Introduction/README/

http://examples.ext.net/#/Getting_Started/Introduction/BREAKING_CHANGES/


--------------------------------------------------------------------------
IV. SAMPLE WEB.CONFIG
--------------------------------------------------------------------------

	<?xml version="1.0"?>
	<configuration>
	  <configSections>
	    <section name="extnet" type="Ext.Net.GlobalConfig" requirePermission="false" />
	  </configSections>

	  <extnet theme="Gray" />
  
	  <system.web>
	    <httpHandlers>
	      <add path="*/ext.axd" verb="*" type="Ext.Net.ResourceHandler" validate="false" />
	    </httpHandlers>

	    <httpModules>
	      <add name="DirectRequestModule" type="Ext.Net.DirectRequestModule, Ext.Net" />
	    </httpModules>

	    <pages>
	      <controls>
	        <add assembly="Ext.Net" namespace="Ext.Net" tagPrefix="ext" />
	      </controls>
	    </pages>
	  </system.web>

	  <system.webServer>
	    <validation validateIntegratedModeConfiguration="false" />
		
	    <modules>
	      <add name="DirectRequestModule" preCondition="managedHandler" type="Ext.Net.DirectRequestModule, Ext.Net" />
	    </modules>
		
	    <handlers>
	      <add name="DirectRequestHandler" verb="*" path="*/ext.axd" preCondition="integratedMode" type="Ext.Net.ResourceHandler" />
	    </handlers>
	  </system.webServer>
  
	  <runtime>
		<assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
		  <dependentAssembly>
			<assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" />
			<bindingRedirect oldVersion="1.0.0.0-5.0.7" newVersion="5.0.8" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="Ext.Net.Utilities" publicKeyToken="2c34ac34702a3c23" />
			<bindingRedirect oldVersion="0.0.0.0-2.2.1" newVersion="2.3.0" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="Transformer.NET" publicKeyToken="e274d618e7c603a7" />
			<bindingRedirect oldVersion="0.0.0.0-2.1.0" newVersion="2.1.1" />
		  </dependentAssembly>
      
		  <!--MVC 3-->
		  <!--
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.Mvc" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-2.0.0.0" newVersion="3.0.0.0" />
		  </dependentAssembly>
		  -->

		  <!--MVC 4-->
		  <!--
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.Mvc" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-5.0.0.0" newVersion="4.0.0.0" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.Helpers" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-2.0.0.0" newVersion="2.0.0.0" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.WebPages" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-2.0.0.0" newVersion="2.0.0.0" />
		  </dependentAssembly>
		  -->

		  <!--MVC 5-->
		  <!--
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.Mvc" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-5.0.0.0" newVersion="5.0.0.0" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.Helpers" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-3.0.0.0" newVersion="3.0.0.0" />
		  </dependentAssembly>
		  <dependentAssembly>
			<assemblyIdentity name="System.Web.WebPages" publicKeyToken="31bf3856ad364e35" />
			<bindingRedirect oldVersion="1.0.0.0-3.0.0.0" newVersion="3.0.0.0" />
		  </dependentAssembly>
		  -->
		</assemblyBinding>
	  </runtime>
	</configuration>


--------------------------------------------------------------------------
V. <extnet> WEB.CONFIG GLOBAL CONFIGURATION PROPERTIES
--------------------------------------------------------------------------
	
    ajaxViewStateMode : ViewStateMode
        Specifies whether the ViewState should be returned and updated on the client during an DirectEvent. 
        The Default value is to Exclude the ViewState from the Response.
        Default is 'Default'. Options include [Default|Exclude|Include]

    cleanResourceUrl : bool
        The Ext.NET controls can clean up the autogenerated WebResource URL so they look presentable.        
        Default is 'true'. Options include [true|false]

	dateTimeZoneHandling : DateTimeZoneHandling
		Specifies how to treat the time value when converting between string and DateTime. 
		It is a Json.NET setting. More details: http://james.newtonking.com/json/help/index.html?topic=html/SerializeDateTimeZoneHandling.htm

	disableViewState : bool
		Specifies whether remove ViewState from page's rendering or not. Defaults to true (remove).

    directEventUrl : string
        The url to request for all DirectEvents.
        Default is "".
                      
    directMethodProxy : ClientProxy
        Specifies whether server-side Methods marked with the [DirectMethod] attribute will output configuration script to the client. 
        If not, the DirectMethods can still be called, but the DirectMethod proxies are not automatically generated. 
        Default is 'Default' (it creates the proxy for each DirectMethod). Options include [Default|Include|Ignore]

	directMethodNamespace : string
		Specifies a custom namespace prefix to use for the DirectMethods. 
		Defaults to App.direct.

    glyphFontFamily : string
        Sets the default font-family to use for components that support a glyph config.
        Default is "".
    
    gzip : bool
        Whether to automatically render scripts with gzip compression.        
        Only works when renderScripts="Embedded" and/or renderStyles="Embedded".       
        Default is true. Options include [true|false]

	idMode : IDMode
		Manages how a control's id is rendered to the client.
		Default is 'Explicit'. Options include [Client|Explicit|Ignore|Inherit|Legacy|Parent|Predictable|Static]

	initScriptMode : InitScriptMode
		Specifies how to render the Ext.NET initialization script. The options are self-explanatory.
		Default is 'Inline'. Options include [Inline|Linked]
        
	licenseKey : string
		The Ext.NET Pro License key.

	locale : string
		Specifies the language of the Ext.NET localization resources to use. For example, "en-GB", "fr-CA", "ru". 
		Default is English.

	namespace : string
		The application's JavaScript namespace. 
		Default is "App".

    renderScripts : ResourceLocationType
        Whether to have the Ext.NET controls output the required JavaScript includes or not.       
        Gives a developer the option of manually including the required <script> files.
        Default is Embedded. Options include [Embedded|File|CDN|None] 

    renderStyles : ResourceLocationType
        Whether to have the Ext.NET controls output the required StyleSheet includes or not.       
        ives a developer the option of manually including the required <script> files.
        Default is Embedded. Options include [Embedded|File|CDN|None]

    resourcePath : string
        Specifies the prefix of the URL path to the base ~/Ext.Net/ folder containing the resources files for this project. 
        The path can be Absolute or Relative.

	resourcesStrategyType : string
		The class name with the logic to map Ext.NET resources to arbitrary URLs, i.e. to provide custom functionality for registering of resources (JavaScript, CSS). 
		Returning "null" for a specific resource means the default URL. Returning an empty string means to prevent registering of a specific resource at all.
		The default strategy is in this file: Ext.Net\Core\ResourcesStrategy.cs.
        
    resetStyles : bool
        True to reset default browser styles.
        Default is false. Options include [true|false]

	rethrowAjaxExceptions : bool
		Rethrow AJAX exceptions from catch sections. 
		Default is false. Options include [true|false]

	rtl : bool
		True to layout the page in "rtl" (right-to-left) mode.
		Default is false. Options include [true|false]

    scriptMode : ScriptMode
        Specifies whether the Scripts should be rendered in Release (minified), Debug (non-minified) or Development (non-minified with additional debug information) mode.
        Default is "Release". Options include [Release|Debug|Development]

	showWarningOnAjaxFailure : bool
		Show a warning dialog on ajax event failure or not.
		Default is 'true'. Options include [true|false].

    sourceFormatting : bool
        Specifies whether the Ext.NET initializaztion script rendered to the page should be formatted. 'True' = formatted/non-minified, 'False' = minified/compressed.
        Default is 'false'. Options include [true|false]
      
    stateProvider : StateProvider
        Specifies the current state provider to maintain the controls' state.
        Default is 'PostBack'. Options include [PostBack|Cookie|None]

	submitDisabled : bool
		If false then disabled fields will not be submitted.
		Default is 'false'. Options include [true|false]
          
    theme : Theme
        Specifies the embedded theme to use.       
        Default is "Default" (blue theme). Options include [Default|Access|Gray|Neptune]
          
    themePath : string
	    Configure the path to the custom theme .css file globally across the entire application. This will override any .Theme setting. 
	    Default is "". 
  
    quickTips : bool
        Specifies whether to render the QuickTips. Provides attractive and customizable tooltips for any element.
        Default is 'true'. Options include [true|false]
		
	
--------------------------------------------------------------------------
VI. CREDITS
--------------------------------------------------------------------------
	
1.  FamFamFam Icons provided by Mark James 
    http://www.famfamfam.com/lab/icons/silk/
	
    See \Build\Resources\Ext\Licenses\FamFamFam.txt for more information.

2.  Flag icons provided by Mark James 
	http://www.famfamfam.com/lab/icons/flags/

	These icons are public domain, and as such are free for any use 
	(attribution appreciated but not required).
	
    See \Build\Resources\Ext\Licenses\FlagIcons.txt for more information.

2.  Silk companion icon set #1 - "More Silk!" provided by Damien Guard
	http://www.damieng.com/icons/silkcompanion

	See \Build\Ext.Net\Licenses\SilkCompanionIcon.txt for more information.

3.  Json.NET provided by James Newton-King
    http://www.codeplex.com/json/
    
    See \Build\Ext.Net\Licenses\Newtonsoft.Json.txt
    
4.  Ext JS JavaScript Library provided by Sencha, Inc.
    http://www.sencha.com/products/js/   
    
    See \Build\Ext.Net\Licenses\ExtJS.txt


--------------------------------------------------------------------------
                               
        Copyright (c) 2007-2013 Ext.NET, Inc., All rights reserved.

                           Ext.NET, Inc.
                         support@ext.net
                           www.ext.net