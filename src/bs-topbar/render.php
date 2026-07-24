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
$link            = trim( $kampania['link'] ?? '' ) ?: '/sklep';
$tekst_przycisku = trim( $kampania['tekstPrzycisku'] ?? '' );

$sekcja_style       = bs_block_sekcja_style( $attributes );
$blok_style         = '--bs-topbar-bg: ' . esc_attr( $kolor_tla ) . '; --bs-topbar-color: ' . esc_attr( $kolor_tekstu ) . ( $sekcja_style ? '; ' . $sekcja_style : '' );
$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'blok-topbar',
	'style' => $blok_style,
] );

?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="blok-topbar__pasek">
		<div class="blok-topbar__suwak">
			<div class="blok-topbar__zestaw">
				<span class="blok-topbar__tekst"><?php echo esc_html( $tekst ); ?></span>
				<?php if ( $tekst_przycisku ) : ?>
					<a class="blok-topbar__przycisk" href="<?php echo esc_url( $link ); ?>">
						<?php echo esc_html( $tekst_przycisku ); ?>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M7.7,145.6C109,125,299.9,116.2,401,121.3c42.1,2.2,87.6,11.8,87.3,25.7"></path></svg>
					</a>
				<?php endif; ?>
			</div>
			<div class="blok-topbar__zestaw" aria-hidden="true">
				<span class="blok-topbar__tekst"><?php echo esc_html( $tekst ); ?></span>
				<?php if ( $tekst_przycisku ) : ?>
					<span class="blok-topbar__przycisk"><?php echo esc_html( $tekst_przycisku ); ?></span>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
