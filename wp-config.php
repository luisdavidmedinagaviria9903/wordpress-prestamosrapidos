<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'TU*SvKNX$o0X$CJlTYE K_[ebEo>]*L=7o7f{aJCC8r/BWz/q(o$oGR=f+b}m#tb');
define('SECURE_AUTH_KEY',  'a+% NOzkRVlaX7^ W#$t(~[j{>SmL#YESBROIa^zg1#^s=(GXDI5w#N>!bC,Vrs>');
define('LOGGED_IN_KEY',    '6?;f>2#pM%&XA_fhMDtwW:=(kfF_b@1;5ZqdA.22;0TsAd:bho$?LUaoc}iO0L3<');
define('NONCE_KEY',        'E%Y[z9qSLOcz9cz%)slV$!vvTc<)guwG  53wIIk*=:Y/&sA#C7wpoU &$=IrY-}');
define('AUTH_SALT',        '1&iHIV`8FF? 3RHx&Bq|`=OsG!b7OnB]EcFNxj!=h$EZS/LY(kn9H91<v.75u0:,');
define('SECURE_AUTH_SALT', 'HtroxA FidfU)EYE&y@Q4+Ymoxb_PhM?7GHtRpfmxIz]&#jyUxibj7ENOw`ZbI5?');
define('LOGGED_IN_SALT',   'V`[a~03vdxciB[QTUWQ M-?p%h,gK6ss>>oC-M12QSnCjMt&LwDmQn-_2LnL{bFt');
define('NONCE_SALT',       'U(-3v6G@o~e6%V&`LbgU6gQDw#>5jhcKSw5>@1QF^P)|L^v6$b$7{,GuUfyr]wX_');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
