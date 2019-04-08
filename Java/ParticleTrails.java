import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.Effect;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerMoveEvent;
import org.bukkit.Material;
import org.bukkit.potion.PotionEffectType;

public class plugin extends JavaPlugin implements Listener {

	public void onEnable() {

		getServer().getPluginManager().registerEvents(this, this);
	}

	@EventHandler
	public void onPlayerMove(PlayerMoveEvent event) {

	    //Player player = event.getPlayer();
	    //player.playEffect(player.getLocation(), Effect.MOBSPAWNER_FLAMES, 5);

	    //player.getLocation().getBlock().setType(Material.FIRE);
	    //PotionEffectType effect = PotionEffectType.FIRE_RESISTANCE;
	    //player.addPotionEffect(effect.createEffect(Integer.MAX_VALUE, 1000));

	}

}
