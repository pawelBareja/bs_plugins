<?php
/**
 * Render template for bs-plugins/bs-karty
 *
 * @var array $attributes Block attributes.
 */

$liczba   = intval( $attributes['liczbaElementow'] ?? 3 );
$elementy = array_slice( $attributes['elementy'] ?? [], 0, $liczba );

$sekcja_style  = bs_block_sekcja_style( $attributes );
$blok_style    = '--bs-karty-cols: ' . $liczba . ( $sekcja_style ? '; ' . $sekcja_style : '' );
$wrapper_attrs = get_block_wrapper_attributes( [
	'class' => 'blok-karty',
	'style' => $blok_style,
] );
?>
<div <?php echo $wrapper_attrs; ?>>
	<?php foreach ( $elementy as $el ) : ?>
		<?php
		$obrazek           = $el['obrazek'] ?? null;
		$arka_obrazka      = ! empty( $el['arkaObrazka'] );
		$kolor_tla         = $el['kolorTla'] ?? '';
		$kolor_tekstu      = $el['kolorTekstu'] ?? '';
		$tytul             = $el['tytul'] ?? '';
		$tresc             = $el['tresc'] ?? '';
		$przycisk_etykieta = $el['przyciskEtykieta'] ?? '';
		$przycisk_url      = $el['przyciskUrl'] ?? '';
		$przycisk_wariant  = $el['przyciskWariant'] ?? 'czerwony';

		$karta_inline = [];
		if ( $kolor_tla ) {
			$karta_inline[] = 'background-color:' . esc_attr( $kolor_tla );
		}
		if ( $kolor_tekstu ) {
			$karta_inline[] = 'color:' . esc_attr( $kolor_tekstu );
		}
		$karta_style = $karta_inline ? ' style="' . implode( ';', $karta_inline ) . '"' : '';

		$obrazek_class = 'blok-karty__obrazek' . ( $arka_obrazka ? ' blok-karty__obrazek--arka' : '' );

		$btn_class = implode( ' ', [
			'blok-przycisk',
			'blok-przycisk--' . esc_attr( $przycisk_wariant ),
			'blok-przycisk--md',
			'blok-karty__przycisk',
		] );
		?>
		<div class="blok-karty__karta"<?php echo $karta_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php if ( $obrazek ) : ?>
				<div class="<?php echo esc_attr( $obrazek_class ); ?>">
					<img src="<?php echo esc_url( $obrazek['url'] ); ?>" alt="<?php echo esc_attr( $obrazek['alt'] ?? '' ); ?>" />
				</div>
			<?php endif; ?>
			<div class="blok-karty__tresc">
				<?php if ( $tytul ) : ?>
					<h3 class="blok-karty__tytul"><?php echo wp_kses_post( $tytul ); ?></h3>
				<?php endif; ?>
				<?php if ( $tresc ) : ?>
					<p class="blok-karty__opis"><?php echo wp_kses_post( $tresc ); ?></p>
				<?php endif; ?>
				<?php if ( $przycisk_etykieta ) : ?>
					<?php if ( $przycisk_url ) : ?>
						<a href="<?php echo esc_url( $przycisk_url ); ?>" class="<?php echo esc_attr( $btn_class ); ?>">
							<?php echo wp_kses_post( $przycisk_etykieta ); ?>
						</a>
					<?php else : ?>
						<span class="<?php echo esc_attr( $btn_class ); ?>">
							<?php echo wp_kses_post( $przycisk_etykieta ); ?>
						</span>
					<?php endif; ?>
				<?php endif; ?>
			</div>
		</div>
	<?php endforeach; ?>
</div>
