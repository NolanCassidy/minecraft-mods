import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.Bukkit;
import org.bukkit.Material;
import org.bukkit.entity.Damageable;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDamageByEntityEvent;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.ShapedRecipe;
import org.bukkit.inventory.meta.ItemMeta;

import java.util.ArrayList;
import java.util.List;

public class plugin extends JavaPlugin implements Listener {

	public void onEnable() {
		List<Material> axes = new ArrayList<Material>();

		axes.add(Material.WOOD_AXE);
		axes.add(Material.STONE_AXE);
		axes.add(Material.GOLD_AXE);
		axes.add(Material.IRON_AXE);
		axes.add(Material.DIAMOND_AXE);

		for (int i = 0; i < axes.size(); i++) {
			ItemStack lifeStealAxe = new ItemStack(axes.get(i), 1);
			ItemMeta meta = lifeStealAxe.getItemMeta();

			ArrayList<String> lore = new ArrayList<String>();
			lore.add("Life Steal");

			meta.setLore(lore);

			lifeStealAxe.setItemMeta(meta);

			ShapedRecipe recipe = new ShapedRecipe(lifeStealAxe);
			recipe.shape(new String[] { " b ", " b ", " a " }).setIngredient('b', Material.BLAZE_ROD).setIngredient('a', axes.get(i));
			Bukkit.getServer().addRecipe(recipe);
		}

		getServer().getPluginManager().registerEvents(this, this);
	}

	@EventHandler
	public void onEntityDamage(EntityDamageByEntityEvent event) {
		if(event.getDamager() instanceof Player) {
			Player player = (Player) event.getDamager();
			if(player.getItemInHand().getItemMeta().getLore().get(0).equalsIgnoreCase("Life Steal")) {
				Damageable playerHealth = (Damageable) player;
				if(playerHealth.getHealth() + (event.getDamage() / 2) < playerHealth.getMaxHealth()) {
					playerHealth.setHealth(playerHealth.getHealth() + (event.getDamage() / 2));
				} else {
					playerHealth.setHealth(playerHealth.getMaxHealth());
				}
			}
		}
	}

}
