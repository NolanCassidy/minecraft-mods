import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.Material;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageEvent;
import org.bukkit.event.entity.EntityDamageEvent.DamageCause;
import org.bukkit.event.player.PlayerInteractEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;

import java.util.Arrays;

public class plugin extends JavaPlugin implements Listener {

	public ItemStack stick;

	public void onEnable() {

		getServer().getPluginManager().registerEvents(this, this);

		stick = new ItemStack(Material.STICK, 1);
		ItemMeta meta = stick.getItemMeta();
		meta.setDisplayName("Broom Stick");
		meta.setLore(Arrays.asList(ChatColor.RED + "This is a Broom Stick!",
		                            ChatColor.RED + "It can fly!",
		                            ChatColor.LIGHT_PURPLE + "It is enchanted!"));

		stick.setItemMeta(meta);

		ShapedRecipe broomStick = new ShapedRecipe(stick);
		broomStick.shape(new String[]{" s ", " s ", " w "})
				.setIngredient('w', Material.WHEAT)
				.setIngredient('s', Material.STICK);

		Bukkit.getServer().addRecipe(broomStick);
	}

	@EventHandler
	public void onPlayerClick(PlayerInteractEvent event) {
		if(event.getPlayer().getItemInHand().equals(stick))	{
			event.getPlayer().setVelocity(event.getPlayer().getLocation().getDirection().multiply(2));
		}
	}

	@EventHandler
	public void onPlayerDrop(EntityDamageEvent event) {
		if (event.getEntity() instanceof Player && event.getCause() == DamageCause.FALL) {
			Player player = (Player) event.getEntity();
			if (player.getItemInHand().equals(stick)) {
				event.setCancelled(true);
			}
		}
	}

}
