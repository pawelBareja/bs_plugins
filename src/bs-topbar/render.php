<?php
/**
 * Render template for bs-plugins/bs-topbar
 *
 * @var array $attributes Block attributes.
 */

$kampanie     = $attributes['kampanie'] ?? [];
$kolor_tla    = $attributes['kolorTla'] ?? '#111111';
$kolor_tekstu = $attributes['kolorTekstu'] ?? '#fff';

$dzisiaj  = current_time( 'm-d' );
$kampania = null;
$domyslna = null;

foreach ( $kampanie as $k ) {
	$od = trim( $k['dataOd'] ?? '' );
	$do = trim( $k['dataDo'] ?? '' );

	if ( '' === $od || '' === $do ) {
		if ( null === $domyslna ) {
			$domyslna = $k;
		}
		continue;
	}

	$w_zakresie = $od <= $do
		? ( $dzisiaj >= $od && $dzisiaj <= $do )
		: ( $dzisiaj >= $od || $dzisiaj <= $do ); // zakres przechodzący przez Nowy Rok

	if ( $w_zakresie ) {
		$kampania = $k;
		break;
	}
}

$kampania = $kampania ?? $domyslna;

if ( ! $kampania || '' === trim( $kampania['tekst'] ?? '' ) ) {
	return;
}

$tekst           = $kampania['tekst'];
$link            = trim( $kampania['link'] ?? '' );
$tekst_przycisku = trim( $kampania['tekstPrzycisku'] ?? '' );

$sekcja_style       = bs_block_sekcja_style( $attributes );
$blok_style         = '--bs-topbar-bg: ' . esc_attr( $kolor_tla ) . '; --bs-topbar-color: ' . esc_attr( $kolor_tekstu ) . ( $sekcja_style ? '; ' . $sekcja_style : '' );
$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'blok-topbar',
	'style' => $blok_style,
] );

$tag = $link ? 'a' : 'div';
?>
<div <?php echo $wrapper_attributes; ?>>
	<<?php echo $tag; ?>
		class="blok-topbar__pasek"
		<?php echo $link ? 'href="' . esc_url( $link ) . '"' : ''; ?>
	>
		<span class="blok-topbar__tekst"><?php echo esc_html( $tekst ); ?></span>
		<?php if ( $tekst_przycisku ) : ?>
			<span class="blok-topbar__przycisk"><?php echo esc_html( $tekst_przycisku ); ?></span>
		<?php endif; ?>
	</<?php echo $tag; ?>>
</div>
