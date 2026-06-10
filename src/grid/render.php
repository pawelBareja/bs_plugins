<?php
/**
 * Render template dla bloku Grid Obraz + Tekst.
 *
 * @var array    $attributes Atrybuty bloku.
 * @var string   $content    Zawartość InnerBlocks (nieużywana).
 * @var WP_Block $block      Instancja bloku.
 */

$obrazek          = $attributes['obrazek'] ?? null;
$tytul            = $attributes['tytul'] ?? '';
$tresc            = $attributes['tresc'] ?? '';
$obrazek_po_lewej = $attributes['obrazekPoLewej'] ?? true;
$kolor_tla        = $attributes['kolorTla'] ?? '';

$grid_class  = 'blok-grid' . ( ! $obrazek_po_lewej ? ' blok-grid--obrazek-prawy' : '' );
$tekst_class = 'blok-grid__tekst' . ( $kolor_tla ? ' blok-grid__tekst--has-bg' : '' );
$tekst_style = $kolor_tla ? ' style="background-color:' . esc_attr( $kolor_tla ) . ';"' : '';

$kolumna_obrazek = sprintf(
	'<div class="blok-grid__obrazek">%s</div>',
	$obrazek
		? sprintf(
			'<img src="%s" alt="%s" />',
			esc_url( $obrazek['url'] ),
			esc_attr( $obrazek['alt'] )
		)
		: ''
);

$kolumna_tekst = sprintf(
	'<div class="%s"%s>%s%s</div>',
	esc_attr( $tekst_class ),
	$tekst_style, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	$tytul ? '<h3 class="blok-grid__tytul">' . wp_kses_post( $tytul ) . '</h3>' : '',
	$tresc ? '<p class="blok-grid__tresc">' . wp_kses_post( $tresc ) . '</p>' : ''
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
