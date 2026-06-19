<?php
/**
 * Render template dla bloku Grid Obraz + Tekst.
 *
 * @var array    $attributes Atrybuty bloku.
 * @var string   $content    Zawartość InnerBlocks.
 * @var WP_Block $block      Instancja bloku.
 */

$obrazek          = $attributes['obrazek'] ?? null;
$tytul            = $attributes['tytul'] ?? '';
$tresc            = $attributes['tresc'] ?? '';
$obrazek_po_lewej = $attributes['obrazekPoLewej'] ?? true;
$kolor_tla        = $attributes['kolorTla'] ?? '';
$kolor_tekstu     = $attributes['kolorTekstu'] ?? '';
$arka_obrazka       = ! empty( $attributes['arkaObrazka'] );
$kolor_arki         = $attributes['kolorArki'] ?? '';
$ozdoba_tekst       = $attributes['ozdobaTekst'] ?? '';
$ozdoba_tekst_kolor = $attributes['ozdobaTekstKolor'] ?? '';
$ozdoba_linia_kolor = $attributes['ozdobaLiniaKolor'] ?? '';

$grid_class = 'blok-grid' . ( ! $obrazek_po_lewej ? ' blok-grid--obrazek-prawy' : '' );

$tekst_inline = array();
if ( $kolor_tla ) {
	$tekst_inline[] = 'background-color:' . esc_attr( $kolor_tla );
}
if ( $kolor_tekstu ) {
	$tekst_inline[] = 'color:' . esc_attr( $kolor_tekstu );
}
$tekst_style = $tekst_inline ? ' style="' . implode( ';', $tekst_inline ) . '"' : '';

$obrazek_class   = 'blok-grid__obrazek' . ( $arka_obrazka ? ' blok-grid__obrazek--arka' : '' );
$arka_style      = ( $arka_obrazka && $kolor_arki ) ? ' style="background-color:' . esc_attr( $kolor_arki ) . '"' : '';

$ozdoba_linia = $ozdoba_linia_kolor
	? sprintf( '<div class="blok-grid__ozdoba-linia" style="background-color:%s"></div>', esc_attr( $ozdoba_linia_kolor ) )
	: '';

$ozdoba_tekst_html = $ozdoba_tekst_kolor
	? sprintf(
		'<div class="blok-grid__ozdoba-tekst" style="color:%s">%s</div>',
		esc_attr( $ozdoba_tekst_kolor ),
		esc_html( $ozdoba_tekst )
	)
	: '';

$kolumna_obrazek = sprintf(
	'<div class="%s"%s>%s%s%s</div>',
	esc_attr( $obrazek_class ),
	$arka_style, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$obrazek
		? sprintf( '<img src="%s" alt="%s" />', esc_url( $obrazek['url'] ), esc_attr( $obrazek['alt'] ) )
		: '',
	$ozdoba_linia,   // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$ozdoba_tekst_html // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);

$kolumna_tekst = sprintf(
	'<div class="blok-grid__tekst"%s>%s%s%s</div>',
	$tekst_style, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$tytul ? '<h3 class="blok-grid__tytul">' . wp_kses_post( $tytul ) . '</h3>' : '',
	$tresc ? '<p class="blok-grid__tresc">' . wp_kses_post( $tresc ) . '</p>' : '',
	$content // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
);
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => $grid_class ) ); ?>>
	<?php if ( $obrazek_po_lewej ) : ?>
		<?php echo $kolumna_obrazek; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php echo $kolumna_tekst; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php else : ?>
		<?php echo $kolumna_tekst; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php echo $kolumna_obrazek; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>
</div>
