<?php
/**
 * JavaScript extension - Includes all *.js files in the directory containing this script
 *
 * @package MediaWiki
 * @subpackage Extensions
 * @author [http://www.organicdesign.co.nz/nad User:Nad]
 * @licence GNU General Public Licence 2.0 or later
 *
 */
if ( !defined( 'MEDIAWIKI' ) ) die( 'Not an entry point.' );

define( 'JAVASCRIPT_VERSION', '3.0.8, 2012-02-15' );

$wgUseMWJquery = true;

$wgExtensionCredits['other'][] = array(
        'name'        => "JavaScript",
        'author'      => "[http://www.organicdesign.co.nz/nad User:Nad]",
        'description' => "Includes all *.js files in the directory containing this script",
        'url'         => "http://www.organicdesign.co.nz/Extension:JavaScript",
        'version'     => JAVASCRIPT_VERSION
);

$wgJavaScriptExterenalPath = wfJavaScriptExternalPath( dirname( __FILE__ ) );

if( version_compare( substr( $wgVersion, 0, 4 ), '1.17' ) < 0 ) {

        $wgHooks['BeforePageDisplay'][] = 'wfJavaScriptAddScripts';

} else {

        $wgResourceModules['ext.organicdesign'] = array(
                'scripts' => array(),
                'styles' => array(),
                'dependencies' => array( 'jquery' ),
                'localBasePath' => dirname( __FILE__ ),
                'remoteExtPath' => basename( dirname( __FILE__ ) ),
                'position' => 'top'
        );

        foreach( glob( dirname( __FILE__ ) . "/*.js" ) as $file ) {
                if( preg_match( "|organicdesign|", $file ) ) $organicdesign = basename( $file );
                elseif( !preg_match( "|jquery|", $file ) ) {
                        $wgResourceModules['ext.organicdesign']['scripts'][] = basename( $file );
                }
        }
        $wgResourceModules['ext.organicdesign']['scripts'][] = basename( $organicdesign );

        foreach( glob( dirname( __FILE__ ) . "/*.css" ) as $file ) {
                if( !preg_match( "|jquery|", $file ) ) {
                        $wgResourceModules['ext.organicdesign']['styles'][] = basename( $file );
                }
        }

        $wgHooks['BeforePageDisplay'][] = 'wfJavaScriptAddModules';

}

/**
 * For MediaWiki 1.17 and later we use the ResourceManager to add modules
 */
function wfJavaScriptAddModules( &$out, $skin = false ) {
        $out->addModules( 'ext.organicdesign' );
        return true;
}

/**
 * This is for MediaWiki 1.16 and earlier
 */
function wfJavaScriptAddScripts( &$out, $skin = false ) {
        global $wgJsMimeType, $wgScriptPath, $wgJavaScriptExterenalPath, $wgUseMWJquery;

        // Load JavaScript files
        foreach( glob( dirname( __FILE__ ) . "/*.js" ) as $file ) {
                $file = wfJavaScriptExternalPath( $file );
                if( !preg_match( "|organicdesign|", $file ) ) {
                        $jquery = preg_match( "|/jquery-\d|", $file );
                        if ( $wgUseMWJquery && is_callable( array( $out, 'includeJQuery' ) ) && $jquery ) {
                                $out->includeJQuery();
                        } else {
                                $out->addScript( "<script src='$file' type='$wgJsMimeType'></script>" );
                        }
                }
                if( $jquery ) $out->addScript( "<script type='$wgJsMimeType'>if(typeof $ != 'function') $=jQuery;</script>" );
        }

        $out->addScript( "<script src='$wgJavaScriptExterenalPath/organicdesign-pre117.js' type='$wgJsMimeType'></script>" );

        // Load CSS files
        foreach( glob( dirname( __FILE__ ) . "/*.css" ) as $file ) {
                $out->addStyle( wfJavaScriptExternalPath( $file ), 'screen', '', 'ltr' );
        }
        return true;
}

/**
 * Convert an internal resource path to an external one
 */
function wfJavaScriptExternalPath( $internalPath ) {
        global $wgScriptPath;
        return preg_replace( "|^.*/extensions|", "$wgScriptPath/extensions", $internalPath );
}
